var debugMode = false;

XSP.addOnLoad(function() {
	hijackAndPublishPartialRefresh();
});


function hijackAndPublishPartialRefresh(){
	
	 XSP._inheritedPartialRefresh = XSP._partialRefresh;
	 XSP._partialRefresh = function( method, form, refreshId, options ){  
	     dojo.publish( 'partialrefresh-init', [ method, form, refreshId, options ]);
	     this._inheritedPartialRefresh( method, form, refreshId, options );
	 }
	 
	 // Publish start, complete and error states 
	 dojo.subscribe( 'partialrefresh-init', function( method, form, refreshId, options ){
	  if( options ){ // Store original event handlers
	   var eventOnStart = options.onStart; 
	   var eventOnComplete = options.onComplete;
	   var eventOnError = options.onError;
	  }

	  options = options || {};  
	  options.onStart = function(){
	   dojo.publish( 'partialrefresh-start', [ method, form, refreshId, options ]);
	   if( eventOnStart ){
	    if( typeof eventOnStart === 'string' ){
	     eval( eventOnStart );
	    } else {
	     eventOnStart();
	    }
	   }
	  };
	  
	  options.onComplete = function(){
	   dojo.publish( 'partialrefresh-complete', [ method, form, refreshId, options ]);
	   if( eventOnComplete ){
	    if( typeof eventOnComplete === 'string' ){
	     eval( eventOnComplete );
	    } else {
	     eventOnComplete();
	    }
	   }
	  };
	  
	  options.onError = function(){
	   dojo.publish( 'partialrefresh-error', [ method, form, refreshId, options ]);
	   if( eventOnError ){
	    if( typeof eventOnError === 'string' ){
	     eval( eventOnError );
	    } else {
	     eventOnError();
	    }
	   }
	  };
	 });
}

dojo.subscribe( 'partialrefresh-init', null, function( method, form, refreshId ){
	if(debugMode) console.log("init " + method + " " + refreshId)
		x$(refreshId).css("border","1px solid #F1F1F1")
		//x$(refreshId).css("border","1px solid red")
		//if(debugMode) console.log("init " + refreshId)
});

dojo.subscribe( 'partialrefresh-start', null, function( method, form, refreshId ){
	if(debugMode) console.log("start " + method + " " + refreshId)
	//x$(refreshId).css("border","1px solid red")
	
	//x$(refreshId).css("border","1px solid green")
	//if(debugMode) console.log("start " + refreshId)
});

dojo.subscribe( 'partialrefresh-complete', null, function( method, form, refreshId ){
	if(debugMode) console.log("complete " + method + " " + refreshId)
	//x$(refreshId).css("border","0px solid green")
	//x$(refreshId).css("border","1px solid red")
	
	if(method == "post"){
		console.log("POST")
		refreshPage(refreshId)
	}
	activateAll();
});

dojo.subscribe( 'partialrefresh-error', null, function( method, form, refreshId ){
	x$(refreshId).css("border","1px solid red")
	$("[id$='timeoutbox']").show()
	logError("Partial Refresh error | Method " + method + " | Form: " + form + " | refreshId" + refreshId)
	if(debugMode) console.log("error " + refreshId)
});

