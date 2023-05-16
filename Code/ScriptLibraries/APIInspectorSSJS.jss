// Sets a global message/message for a field
function addFacesMessage( message, component ){
	try {
		if( typeof component === 'string' ){
			component = getComponent(component);
		}
		
		var clientId = null;
		if( component ){
			clientId = component.getClientId(facesContext);
		}
		
		facesContext.addMessage( clientId, new javax.faces.application.FacesMessage( message ) );
	} catch (e) { Debug.exception(e); }
}

// Workaround for validation/partial refresh/no update 
function getSubmittedValue( componentId ){
	var paramFieldName = getClientId( componentId ); 
	var parameter = param.get( paramFieldName );
	return (parameter) ? parameter.toString() : ''; 
} 

var APIInspector = {
	beforeRenderResponse: function(){
		try {
			this.storePreviousExpression();
			
			// Reset exception- and expression info
			viewScope.remove( 'exception' );
			viewScope.remove( 'expressionInfo' );			
			
			var componentId = viewScope.componentId;
			var expression = (componentId) ? 'getComponent( \'' + componentId + '\' )' : viewScope.expression;	
			if( !expression ){ return; }
				
			var expressionObj, expressionClass, expressionValue, exceptionString;	
			
			// Test expression as an expression
			try {
				// Fix for expression being interpreted as string
				expressionObj = eval( 'var foo;' + expression );						
				expressionClass = expressionObj.getClass();	
				expressionValue = expressionObj.toString();				
			} catch(e){
				exceptionString = Debug.getExceptionString( e );
				
				try { // Test expression as a class
					expressionClass = eval( 'new ' + expression + '()' ).getClass();
					exceptionString = ''; //Reset in case evaluation is OK
				} catch(e){					
					exceptionString = Debug.getExceptionString( e );
					
					try { // Try expression as Class without constructor
						expressionClass = java.lang.Class.forName( expression );
						exceptionString = ''; //Reset in case evaluation is OK
					} catch(e){
						exceptionString = Debug.getExceptionString( e );										
					}
				}
			}
			
			if( expressionClass ){ 
				className = expressionClass.getName(); }
			else {	
				if( !exceptionString ){ exceptionString = 'No class found for ' + expression; }
			}
			
			if( exceptionString ){
				viewScope.put( 'expressionInfo', '' );		
				addFacesMessage( exceptionString, 'inspectorMessages' );
				return;
			}
			
			viewScope.put( 'expressionInfo', {
				className: className,	
				value: expressionValue,
				
				methods: ExpressionParser.parseMethodOrField( expressionClass.getMethods() ),
				declaredMethods: ExpressionParser.parseMethodOrField( expressionClass.getDeclaredMethods() ),
					
				fields: ExpressionParser.parseMethodOrField( expressionClass.getFields() ),
				declaredFields: ExpressionParser.parseMethodOrField( expressionClass.getDeclaredFields() )
			});
			
			// Reset combo boxes
			viewScope.remove( 'componentId' );
			viewScope.remove( 'previousExpressions' );		
		} catch( e ){
			viewScope.put( 'expressionInfo', '' );
			Debug.exceptionToPage( e, 'inspectorMessages' );
		}	
	},
	
	// Walks the node tree to collect all components
	getChildren: function( component ){
		try {
			var children = component.getChildren();
			var numChildren = children.size();
			var componentChildren = [];
			if( numChildren === 0 ){ 
				return null; 
			} else {		
				for( var i = 0; i < numChildren; i++ ){
					var childNode = children.get( i );
					componentChildren.push( childNode );
					var childrenBelowChild = this.getChildren( childNode );
					if( childrenBelowChild !== null ){
						componentChildren = componentChildren.concat( childrenBelowChild );
					}
				}
			}
			return componentChildren;
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	/**
	*	Fetch most (no support for repeat controls) ids
	*/
	getComponentIds: function(){
		try {
			// Loops through all child elements of the container component, view	
			var allChildren = this.getChildren( view );
			var size = allChildren.length;
			
			// Show _components (eventHandlers++)
			var showHiddenComponents = ( viewScope.showHiddenComponents === 'show' );
			
			var itemsArr = [];
			for( var i=0; i < size; i++ ){
				var child = allChildren[i];
				
				var id = child.getId();
				
				// Skip
				if( !id || ( !showHiddenComponents && id.substring( 0, 1 ) === '_' ) ){ continue; }
				
				itemsArr.push( id );			
			}
			
			return itemsArr;
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	getXPageNames: function(){
		try {
			// Returns an array with the names of all XPages
			var xpageNames = viewScope.xpageNames;		
			if( xpageNames ){ return xpageNames; }
			
			xpageNames = [];
			
			// Only select XPages
			var noteCollection = database.createNoteCollection( false );
			noteCollection.setSelectMiscFormatElements( true );
			noteCollection.setSelectionFormula( '$flags="gC~4K" & @Contains( $title ; ".xsp" )' );
			noteCollection.buildCollection();
			
			// Extrax the names of the XPages, exclude the current page
			var xpageDoc, xpageName, xpageNoteId = noteCollection.getFirstNoteID();
			while( xpageNoteId ){
				xpageDoc = database.getDocumentByID( xpageNoteId );
				xpageName = xpageDoc.getItemValueString( '$title' );
				if( view.getPageName().indexOf( xpageName ) === -1 ){
					xpageNames.push( '/' + xpageName );
				}
				
				xpageNoteId = noteCollection.getNextNoteID( xpageNoteId );
			}
			
			viewScope.put( 'xpageNames', xpageNames );
			return xpageNames;
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	makeMainClassLinks: function(){
		try {
			var expressionInfo = viewScope.expressionInfo;
			if( !expressionInfo ){ return; }
			
			var className = expressionInfo.className;
			
			return '<h1 style="display:inline">' + className + '</h1>'
				+ ExpressionParser.makeAPILinks( className );
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	makeInheritedLinks: function( className ){
		try {
			return 'Inherited from: ' + className + ExpressionParser.makeAPILinks( className );
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	makeReturnTypeLinks: function( className ){
		try {
			return 'Returns object of type: ' + className + ExpressionParser.makeAPILinks( className );
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	storePreviousExpression: function(){
		try {
			var previousExpression = viewScope.expression;
			if( !previousExpression ){ return; }
			
			var previousExpressions = sessionScope.previousExpressions || [];
			previousExpressions.unshift( @Left( previousExpression, 30 ) + '|' + previousExpression );
			if( previousExpressions.length > 1 ){
				previousExpressions = @Trim( @Unique( previousExpressions ) );
			}
			
			sessionScope.put( 'previousExpressions', previousExpressions );			
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	}
}

// Helper-class for debugging
var Debug = {
	// Send a stack trace of an exception
	exception: function( exception ){
		// If on localhost/public db - throw exception
		if (this.getUserName() === 'Anonymous'){
			throw exception;
		}
		
		this.message( this.getExceptionString( exception ), 'Exception!' );
	}, 
	
	// Add exception to page
	exceptionToPage: function( exception, messageComponentId ){
		this.setPageDebugMessage('Exception: ' + this.getExceptionString( exception, messageComponentId ) );
	}, 
	
	getExceptionString: function( exception ){
		var errorMessage = exception.message;
		
		if (typeof exception.printStackTrace !== 'undefined'){
			var stringWriter = new java.io.StringWriter();
			exception.printStackTrace( new java.io.PrintWriter( stringWriter ) );
			errorMessage = stringWriter.toString();
		}
		
		if (typeof exception === 'com.ibm.jscript.InterpretException'){
			errorMessage = exception.getNode().getTraceString() + '\n\n' + errorMessage;
		}
		
		return errorMessage;
	}, 
	
	getUserName: function(){
		return @Name( '[CN]',  @UserName() );
	}, 
	
	// Send a message (supports HTML)
	message: function(message, subject){
		// If on localhost/public db - throw exception
		if (this.getUserName() === 'Anonymous'){
			throw 'Not logged in. Could not send message: ' + message;
		}
		
		session.setConvertMime( false );
		var doc:NotesDocument = database.createDocument();
		doc.replaceItemValue('Form', 'Memo');
		doc.replaceItemValue('Subject', subject || 'Debug..');
		doc.replaceItemValue('SendTo', this.getUserName());
		
		var body:NotesMIMEEntity = doc.createMIMEEntity();
		
		var contentStream = session.createStream();
		// Set preferred styling
		contentStream.writeText('');
		
		// Convert linefeeds to <br>s
		contentStream.writeText( message.replace( '\n', '<br />' ) );
		body.setContentFromText( contentStream, 'text/html;charset=ISO-8859-1', 
			lotus.domino.MIMEEntity.ENC_NONE );
		doc.send();
		
		session.setConvertMime( true );
	}, 
	
	// Add message to page
	messageToPage: function( message, messageComponentId ){
		this.setPageDebugMessage( message, messageComponentId );
	}, 
	
	// Adds message to the bottom of the page in a dynamically created xp:text
	setPageDebugMessage: function( message, messageComponentId ){
		
		// If a specific message component id is specified, use this instead of creating one
		if( messageComponentId ){
			addFacesMessage( message, messageComponentId );
			return;
		}
		
		var componentId = 'global-debug-messages';
		
		var messageControl = getComponent( componentId );
		if( !messageControl ){
			messageControl = new com.ibm.xsp.component.xp.XspOutputText();
			messageControl.setId( componentId );
			messageControl.setEscape(false);
			messageControl.setStyleClass('xspMessage');
			
			var valueBinding = facesContext.getApplication().createValueBinding('#{requestScope.debugMessages}');
			messageControl.setValueBinding('value', valueBinding);
			
			view.getChildren().add( messageControl );
		}
		
		var currentMessages = requestScope.debugMessages;
		if (typeof currentMessages !== 'string'){
			currentMessages = '';
		}
		requestScope.put( 'debugMessages', message + '<br />' + currentMessages );
	}
} 

var ExpressionParser = {
	// Extracts info about method/field into an object
	parseMethodOrField: function( items ){
		try {		
			var item, parsedItems = [];
			for( var i=0; i < items.length; i++ ){
				item = items[i];
				if( item ){ item = item.toString(); }
				if( !item || item.indexOf( 'private' ) > -1 ){ continue; }
				
				var commandThrows = '';
				var throwsRegExp = new RegExp( ' throws [\\w\\.]+$' );
				if( throwsRegExp.test( item ) ){
					commandThrows = item.match( throwsRegExp )[0];
					item = item.replace( commandThrows, '' );
				}					
				
				var itemTokens = item.split(' ');
				var numItems = itemTokens.length;
				var commandWithClass = itemTokens[ itemTokens.length-1 ];
				var command = ( /\.\w+\(.*[^)]*\)/.test( commandWithClass ) ) ? 
					commandWithClass.match( /\.\w+\(.*[^)]*\)/ )[0].substring(1) : @RightBack( commandWithClass, '.' );
					
				var commandClass = commandWithClass.replace( '.' + command, '' );
				var returnClass = itemTokens[ itemTokens.length-2 ];
				var modifiers = item.replace( ' ' + commandClass + ' ' + command, '' );
				
				parsedItems.push({
					command: command,
					commandThrows: commandThrows,
					commandClass: commandClass,
					returnClass: returnClass,
					modifiers: modifiers				
				});								
			}			
						
			// Sort by field/method name
			parsedItems.sort( function( a, b ){
				if( a.command > b.command ){ return 1; }
				if( a.command < b.command ){ return -1;	}
				return 0;
			});
			
			return parsedItems;
		} catch( e ){			
			viewScope.put( 'expressionInfo', '' ); 
			Debug.exceptionToPage( e, 'inspectorMessages' );
		}
	},
	
	isIBMClassName: function( className:String ){
		try {
			return (className.indexOf( 'com.ibm' ) == 0);
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	isJavaClassName: function( className:String ){
		try {
			return (className.indexOf( 'java' ) == 0);
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	isJSFClassName: function( className:String ){
		try {
			return (className.indexOf( 'javax.faces' ) === 0);
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	makeAPILinks: function( className:String ){
		try {
			var links = [];
			if( this.isJSFClassName( className ) ){
				links.push( this.makeJSFAPILink( className ) );
			} else {
				if( this.isJavaClassName( className ) ){
					links.push( this.makeJavaAPILink( className ) );
				}
			}
			
			if( this.isIBMClassName( className ) ){
				links.push( this.makeIBMAPILink( className ) );
			}
			
			// Not any of the API links -> make a google link
			if( links.length === 0 ){
				links.push( this.makeGoogleLink( className ) );
			}
			
			return links.join('');
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	// If IBM class -> returns link to IBM/XPages API
	makeIBMAPILink: function( className:String ){
		try {
			var basePath = 'http://public.dhe.ibm.com/software/dw/lotus/Domino-Designer/JavaDocs/XPagesExtAPI/8.5.2/';
			var classPath = className.replace( /\./g, '/' ) + '.html';
			return  '<a target="_blank" class="more-info ibm" href="' + basePath + classPath + '">XPages</a>';
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	// If Java Class -> returns link to Java API
	makeJavaAPILink: function( className:String ){
		try {
			var basePath = 'http://java.sun.com/javase/6/docs/api/';
			var classPath = className.replace( /\./g, '/' ) + '.html';
			return  '<a target="_blank" class="more-info java" href="' + basePath + classPath + '">Java</a>';
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	// If JSF Class -> returns link to JSF API 
	makeJSFAPILink: function( className:String ){
		try {
			var basePath = 'http://download.oracle.com/docs/cd/E17802_01/j2ee/j2ee/javaserverfaces/1.1_01/docs/api/';
			var classPath = className.replace( /\./g, '/' ) + '.html';
			return  '<a target="_blank" class="more-info jsf" href="' + basePath + classPath + '">JSF</a>';
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	},
	
	// Make Google link
	makeGoogleLink: function( className:String ){
		try {
			return '<a target="_blank" class="more-info google" href="http://google.com/search?q=' + className + '">Google</a>';
		} catch( e ){ Debug.exceptionToPage( e, 'inspectorMessages' ); }
	}
};
