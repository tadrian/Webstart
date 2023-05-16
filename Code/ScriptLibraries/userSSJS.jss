
var userObjects = {

	// init user tabs and boxes
	init: function(uid){	
		
		var userBoxes = new java.util.HashMap()
		var key = "Box_UID_" + uid;
		var dcboxes = database.getView("LookupKey").getAllDocumentsByKey(key, true);
		var dbox = dcboxes.getFirstDocument();
		while (dbox != null) {
			var boxTitle = dbox.getItemValueString("Title");
			var tabTitle = BeanMethods.getTabTitle(dbox.getItemValueString("TabId"));
			userBoxes.add(tabTitle + " \\ " + boxTitle + "|" + dbox.getItemValueString("UniqueId"));
			dbox = dcboxes.getNextDocument(dbox);
		}
		
		key = "TAB_UID_" + uid;
		dctabs = database.getView("LookupKey").getAllDocumentsByKey(key, true);

		var dtab = dctabs.getFirstDocument();
		while (dtab != null) {
			var tabTitle = dtab.getItemValueString("Title");
			userTabs.add(tabTitle + "|" + dtab.getItemValueString("UniqueId"));
			dtab = dctabs.getNextDocument(dtab);
		}
		
		var hm = new java.util.HashMap()
		hm.put("UserTabs",userTabs)
		hm.put("UserBoxes",userBoxes)
		sessionScope.put(hm)
	}
};





function loginUser(){
	try{
		
		

		// Generate a session ID
		var sessionID = java.util.UUID.randomUUID().toString();

		var us = getComponent("username").getValue();
		var pw = getComponent("password").getValue();
		us = us.toLowerCase();
		if(us==""){
			viewScope.Msg = "Not a valid email"
			return false;
		}
		
		if(pw==""){
			viewScope.Msg = "Not valid password"
			return false;
		}

		var key = "User_UNAME_" + us
		var udoc:NotesDocument = database.getView("LookupKey").getDocumentByKey(key,true)
		if(udoc){
			
				if(pw == udoc.getItemValueString("Password")){
					
					var userid = udoc.getItemValueString("UniqueID");
					viewScope.Msg = addCookieX("session",sessionID,"store");
					
					var v = $V(udoc.getItemValue("sessionID"))
					if(!v.contains(sessionID)){
						v.add(sessionID)
						udoc.replaceItemValue("sessionID",v)
						udoc.computeWithForm(false,false)
						udoc.save()
					}
					sessionScope.remove("BeanMethods")
					//BeanMethods.loadNewUserSession();
					
					facesContext.getExternalContext().redirect("./start.xsp")
				}else{
					viewScope.Msg = "password missmatch"
					return false
				}
		}else{
			viewScope.Msg = "user not found"
		}
		
	}catch(e){
		viewScope.Msg = e
	}
}

function validateUser(){
	try{
		var c = getCookieValueX("session");
		var key = "User_SID_" + c
		var userd = database.getView("LookupKey").getDocumentByKey(key,true)
		if(userd!=null){
			return true
		}
	}catch(e){
		print(e)
	}	
}

function getCookieValueX(cookieName){
	try{
		return cookie.get(cookieName).getValue();
	}catch(e){
		return ""
	}
}    


function addCookieX(name,value,type){

	try{
	
		var response = facesContext.getExternalContext().getResponse();
		var cc = new javax.servlet.http.Cookie(name,value);
		if(type=="store"){
			cc.setMaxAge(864000);	// 10 days	
			cc.setPath("/");	
			//c.setPath(path);
		}else if(type=="remove"){
			cc.setMaxAge(0);
			cc.setPath(path);
		}else if(type=="session"){
			cc.setMaxAge(-1);
			cc.setPath(path);
		}
		
		response.addCookie(cc);
		return "ok"
	
	}catch(e){
		viewScope.Msg = e
		return e
	}
}

function getCurrentUserDoc(){
	try{
		var userid = getCookieValueX("session");
		if(@Trim(userid)!=""){
			var v = database.getView("LookupKey");
			var userdocc = database.getView("LookupKey").getDocumentByKey("User_SID_" + userid,true);
			if(userdocc!=null){
				return userdocc;	
			}
		}
		
	}catch(e){
		
	}	
}