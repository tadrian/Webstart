//importPackage (java.util.Vector);
import utilsSSJS;
import logSSJS;
import adminSSJS;
import userSSJS;
import rpcActionSSJS;
importPackage (com.consili)


function MakeSureAllBookmarkInOrderField(boxid){
	try{
		var boxd = BeanMethods.getBoxDoc(boxid)
		var v = boxd.getItemValue("BookmarkOrder")
		var nvec = database.getView("lookupkey").getAllEntriesByKey("Bookmark_BoxID_"  + boxid,true)
		if(!v.isEmpty()){
				var entry = nvec.getFirstEntry()
				while(entry!=null){
					var bmid = entry.getDocument().getItemValueString("UniqueId");
					if(!v.contains(bmid)){
						v.add(bmid)
					}
					var tmp = entry;
					entry = nvec.getNextEntry(entry)
					tmp.recycle();
				}
				boxd.replaceItemValue("BookmarkOrder",v)
				boxd.computeWithForm(false,false)
				boxd.save()
				
				
		}
		
	}catch(e){
		Logger.LogError(e.toString());
	}
}

function MakeSureAllBookmarkInOrderField(boxid){
	try{
		
		
		var boxd = BeanMethods.getBoxDoc(boxid)
		var v1 = boxd.getItemValue("BookmarkOrder")
		var v2 = BeanMethods.getAllBookmarksInBox(boxid);
		var ret = BeanMethods.mergeVectors(v1,v2)
		boxd.replaceItemValue("BookmarkOrder",ret)
		boxd.computeWithForm(false,false)
		boxd.save()
		
	}catch(e){
		Logger.LogError(e.toString());
	}
}

function getFaIcon(icon,txt){
	var ic = "<i class='fa fa-" + icon + "' style='float:right'></i>";
	return txt + ic;
}




// UI Actions

function removeTab(tabid){

	try{
		var tabd:NotesDocument = BeanMethods.getTabDoc(tabid)
		var paged = getPageDoc()
		
		// remove all bookmarks in all boxes in tab
		var dcboxes = getBoxesFromTab(tabid)
		for(var i=1;i<=dcboxes.getCount();i++){
			var boxd = dcboxes.getNthDocument(i)
			removeBookmarksFromBox(boxd.getItemValueString("UniqueID"))
		}
	
		// remove boxes from tab
		dcboxes.removeAll(true)
		
		
		// remove order from page
		var v:java.util.Vector = paged.getItemValue("TabOrder")
		if(v.contains(tabid)){
			v.remove(tabid)
			paged.replaceItemValue("TabOrder",v)
			paged.save()
		}
		
		// remove tab
		tabd.remove(true)
		BeanMethods.setUserTabs()
		BeanMethods.setUserBoxes()
		
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}



function getUserId(){
	var uid = getCurrentUserDoc().getItemValueString("UniqueId");
	return uid==="" ? "-" : uid
}

function removeBookmarksFromBox(boxid){
	
	print("Removing bookmarks from " + boxid)
	var boxd = BeanMethods.getBoxDoc(boxid)
	
	var key = "Bookmark_BOXID_" + boxid
	var dc = database.getView("LookupKey").getAllDocumentsByKey(key,true)
	dc.removeAll(true)
	boxd.replaceItemValue("BookmarkOrder","")
	boxd.save()
}

function removeDoneBookmarksFromBox(boxid){
	
	var boxd = BeanMethods.getBoxDoc(boxid)
	var key = "Bookmark_BOXID_" + boxid + "_TEXTSTYLE_1"
	var dc = database.getView("LookupKey").getAllDocumentsByKey(key,true)
	var v = boxd.getItemValue("BookmarkOrder");
	var dc2:NotesDocumentCollection = database.createDocumentCollection()
	if(!v.isEmpty()){
		
		var d:NotesDocument = dc.getFirstDocument()
		while(d!=null){
			var bmid = d.getItemValueString("UniqueID")
			if(v.contains(bmid)){
				v.remove(bmid)
				dc2.addDocument(d)
			}
			d = dc.getNextDocument(d)
		}
		boxd.replaceItemValue("BookmarkOrder",v)
		boxd.save()
		dc2.removeAll(true)
	
	}else{
		boxd.replaceItemValue("BookmarkOrder","")
		boxd.save()
		dc.removeAll(true)
			
	}
	
	
}




// Helpers

function removeBookmarks(boxid){

	var db = sessionAsSigner.getCurrentDatabase()
	var key = "Bookmark_BOXID_" + boxid
	var bmdc:NotesDocumentCollection = db.getView("LookupKey").getAllDocumentsByKey(key,true)
	bmdc.removeAll(true)
}




function removeBox(boxid){
	
	try{
		
	
	var db = sessionAsSigner.getCurrentDatabase()
	removeBookmarks(boxid)
	
	
	// remove BoxOrder from tab
	var tabdoc = BeanMethods.getTabDocFromBoxId(boxid)
	var tabid = tabdoc.getItemValueString("UniqueId")
	var v1:java.util.Vector = tabdoc.getItemValue("BoxOrderCol1")
	var v2:java.util.Vector = tabdoc.getItemValue("BoxOrderCol2")
	var v3:java.util.Vector = tabdoc.getItemValue("BoxOrderCol3")
	var v4:java.util.Vector = tabdoc.getItemValue("BoxOrderCol4")
	var v5:java.util.Vector = tabdoc.getItemValue("BoxOrderCol5")
	var upd = false;
	if(v1.contains(boxid)){
		v1.remove(boxid)
		tabdoc.replaceItemValue("BoxOrderCol1",v1)
		upd = true
	}
	if(v2.contains(boxid)){
		v2.remove(boxid)
		tabdoc.replaceItemValue("BoxOrderCol2",v2)
		upd = true
	}
	if(v3.contains(boxid)){
		v3.remove(boxid)
		tabdoc.replaceItemValue("BoxOrderCol3",v3)
		upd = true
	}
	if(v4.contains(boxid)){
		v4.remove(boxid)
		tabdoc.replaceItemValue("BoxOrderCol4",v4)
		upd = true
	}
	if(v5.contains(boxid)){
		v5.remove(boxid)
		tabdoc.replaceItemValue("BoxOrderCol5",v5)
		upd = true
	}
	if(upd){
		tabdoc.computeWithForm(false,false)
		tabdoc.save()
	}
	
	// remove box
	var key = "Box_UNID_" + boxid
	var boxd = db.getView("LookupKey").getDocumentByKey(key,true)
	boxd.remove(true)
	BeanMethods.updateUserBoxes()
	
	//facesContext.getExternalContext().redirect("./start.xsp#" +  tabid)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}





function setBookmarkDone(bmdoc){
	try{
		var vv = database.getView("LookupKey")
		var bmid = bmdoc.getItemValueString("UniqueId")
		var boxdoc = getBoxDocFromBookmarkDoc(bmdoc)
		var boxid = boxdoc.getItemValueString("UniqueId")
		var v:java.util.Vector = boxdoc.getItemValue("BookmarkOrder")
		v.remove(bmid)
	
		if(!v.isEmpty()){
				v.add(bmid)
		}else{
			var v = BeanMethods.getAllBookmarksInBox(boxid)
			v.add(bmid)
		}		
		boxdoc.replaceItemValue("BookmarkOrder",v)
		boxdoc.computeWithForm(false,false)
		boxdoc.save()
	}catch(e){
		Logger.LogError(e.toString());
	}
	
}




function removeBoxesFromTab(tabid){
	
	try{
	var dc = getBoxesFromTab(tabid)
	for(var i=1;i<=dc.getCount();i++){
		var bd = dc.getNthDocument(i)
		removeBookmarks(bd.getItemValueString("UniqueID"))
	}
	dc.removeAll(true)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}

function getBookmarksInBox(boxid){
	try{
	var key = "Bookmark_BOXID_" + boxid
	var dc = database.getView("LookupKey").getAllDocumentsByKey(key,true)
	return dc
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}


function getPageDoc(){
	try{
	var vv = database.getView("LookupKey");
	var userid = getCurrentUserDoc().getItemValueString("UniqueID")
	var tkey = "Page_UID_" + userid
	return vv.getDocumentByKey(tkey, true)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}

function getBoxDocFromBookmarkDoc(bmdoc){
	try{
		var boxid = bmdoc.getItemValueString("Boxid");
		var vv = database.getView("LookupKey");
		var tkey = "Box_UNID_" + boxid
		return vv.getDocumentByKey(tkey, true)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}







function getBookmarkTitle(bmid){
	return getBookmarkDoc(bmid).getItemValueString("Title")
}

function getBoxesFromTab(tabid){

	try{
	var vv = database.getView("LookupKey");
	var tkey = "Box_Tabid_" + tabid
	return database.getView("LookupKey").getAllDocumentsByKey(tkey,true)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}

function getTabDocFromBoxId(boxid){
	try{
	var boxd = BeanMethods.getBoxDoc(boxid);
	var tabid = boxd.getItemValueString("TabID")
	return getTabDoc(tabid)
	}catch(e){
		Logger.LogError(e.toString());
		print(e)
	}
}

function getTabIdFromBoxId(boxid){
	var boxd = BeanMethods.getBoxDoc(boxid);
	var tabid = boxd.getItemValueString("TabID")
	return tabid
	
	
}






