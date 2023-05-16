

function doEventLog(msg){
	try{

		var ndoc = database.createDocument()
		ndoc.replaceItemValue("Form","Log");
		var ag = context.getUserAgent().getUserAgent();
		var path:string = facesContext.getExternalContext().getRequest().getRequestURI();
		var ip:string = facesContext.getExternalContext().getRequest().getRemoteAddr();
		var m:string = facesContext.getExternalContext().getRequest().getMethod();
		var qs:string = facesContext.getExternalContext().getRequest().getQueryString();
		var extlib:string = com.ibm.xsp.extlib.util.ExtLibUtil.getExtLibVersion();
		
		ndoc.replaceItemValue("Url",ag);
		ndoc.replaceItemValue("Path",path);
		ndoc.replaceItemValue("Method",m);
		ndoc.replaceItemValue("IP",ip);
		ndoc.replaceItemValue("QueryString",qs);
		ndoc.replaceItemValue("ExtLib",extlib);
		ndoc.replaceItemValue("DomVersion",session.getNotesVersion());
		ndoc.replaceItemValue("Platform",session.getPlatform());
		ndoc.replaceItemValue("Error","LogEvent doEventLog " + msg);
		ndoc.computeWithForm(false,false)
		ndoc.save();
		
	}catch(e){
		print(e)
	}
	
}

function doLog(exception,component){
		
		
		var ndoc = database.createDocument();
		ndoc.replaceItemValue("Form","Log");
		ndoc.replaceItemValue("Error","1");
		ndoc.replaceItemValue("LogMessage",exception);
		ndoc.computeWithForm(false,false)
		ndoc.save();
		print("Error in doLog rpc" + exception)
}