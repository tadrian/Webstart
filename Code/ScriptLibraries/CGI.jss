/* 
      This server-side JavaScript library implements a class named "CGIVariables" which allows for easy access 
      to most CGI variables in XPages via JavaScript. 
      For example, to dump the remote users name, IP address and browser string to the server console, use: 
      You can also find this server-side JavaScript library in the Domino 8.5 "discussion8.ntf" template as "xpCGIVariables..jss".
       
      var cgi = new CGIVariables(); 
      print ("Username: " + cgi.REMOTE_USER); 
      print ("Address : " + cgi.REMOTE_ADDR); 
      print ("Browser : " + cgi.HTTP_USER_AGENT); 
 
      Written July 2008 by Thomas Gumz, IBM. 
*/  
function CGIVariables() { 
      // setup our object by getting refs to the request and servlet objects         
      try { 
              this.request = facesContext.getExternalContext().getRequest(); 
              this.servlet = facesContext.getExternalContext().getContext(); 
      } catch(e) { 
              print (e.message); 
      } 
 
      this.prototype.AUTH_TYPE            = this.request.getAuthType(); 
      this.prototype.CONTENT_LENGTH       = this.request.getContentLength(); 
      this.prototype.CONTENT_TYPE         = this.request.getContentType(); 
      this.prototype.CONTEXT_PATH         = this.request.getContextPath(); 
      this.prototype.GATEWATY_INTERFACE   = "CGI/1.1"; 
      this.prototype.HTTPS                = this.request.isSecure() ? "ON" : "OFF"; 
      this.prototype.PATH_INFO            = this.request.getPathInfo(); 
      this.prototype.PATH_TRANSLATED      = this.request.getPathTranslated(); 
      this.prototype.QUERY_STRING         = this.request.getQueryString(); 
      this.prototype.REMOTE_ADDR          = this.request.getRemoteAddr(); 
      this.prototype.REMOTE_HOST          = this.request.getRemoteHost(); 
      this.prototype.REMOTE_USER          = this.request.getRemoteUser(); 
      this.prototype.REQUEST_METHOD       = this.request.getMethod(); 
      this.prototype.REQUEST_SCHEME       = this.request.getScheme(); 
      this.prototype.REQUEST_URI          = this.request.getRequestURI(); 
      this.prototype.SCRIPT_NAME          = this.request.getServletPath(); 
      this.prototype.SERVER_NAME          = this.request.getServerName(); 
      this.prototype.SERVER_PORT          = this.request.getServerPort(); 
      this.prototype.SERVER_PROTOCOL      = this.request.getProtocol(); 
      this.prototype.SERVER_SOFTWARE      = this.servlet.getServerInfo(); 
 
      // these are not really CGI variables, but useful, so lets just add them for convenience 
      this.prototype.HTTP_ACCEPT          = this.request.getHeader("Accept"); 
      this.prototype.HTTP_ACCEPT_ENCODING = this.request.getHeader("Accept-Encoding"); 
      this.prototype.HTTP_ACCEPT_LANGUAGE = this.request.getHeader("Accept-Language"); 
      this.prototype.HTTP_CONNECTION      = this.request.getHeader("Connection"); 
      this.prototype.HTTP_COOKIE          = this.request.getHeader("Cookie");         
      this.prototype.HTTP_HOST            = this.request.getHeader("Host");         
      this.prototype.HTTP_REFERER         = this.request.getHeader("Referer"); 
      this.prototype.HTTP_USER_AGENT      = this.request.getHeader("User-Agent");
}
 
function urls(){

	var o = new Object()
	o.contextPath = facesContext.getExternalContext().getRequest().getContextPath(); 
	return o;	
	
	
}