
function getDbPath(){
	return "." +  facesContext.getExternalContext().getRequest().getRequestURI();
}

function getDbPathPage(){
	return "." + facesContext.getExternalContext().getRequest().getRequestURI() + "/start.xsp"

}

function getNSFPath(url) {
    return url.substring(0, url.lastIndexOf('/'));
}

function getComponentValue(id){
	var field = getComponent(id);
	var value = field.getSubmittedValue(); 
	if( null == value ){ 
	    // else not yet submitted 
		value = field.getValue(); 
	}
	return value;
}

function $V(o){
	try{
		var vec:java.util.Vector = new java.util.Vector();
		if(typeof o === "string"){
			vec.add(o)	
		}else{
			vec.addAll(o)		
		}
		return vec
	}catch(e){
	}	
}

function refreshDataPanel(componentid){
	var c = getComponent(componentid);
		if(c!=null){
		var ds = c.getData();
		if(ds!=null){
			ds.get(0).refresh();
		}
	}
}

function encodeString(txt){
	return encodeURIComponent(txt);
}

function getD(d){
	if(typeof d == "NotesXspDocument" || typeof d == "lotus.domino.local.ViewEntry" || typeof d == "NotesXspViewEntry"){
		return d.getDocument();
	}else{
		return d;		
	} 
	
}
function getPageName(){
	var path:string = facesContext.getExternalContext().getRequest().getRequestURI()
	return session.evaluate("@RightBack(\"" + path + "\"; \"/\")").get(0)
}
