var action = {
		// Send partial refresh error to log
		logError: function(error) {
			try{
				Logger.LogEvent(error)
			}catch(e){
				Logger.LogError(e.toString())
				
			}
			return error				
		},
		createQuickText: function(boxid, txt) {
			
			try{
				
				Logger.LogEvent("RPC createQuickText");
				var bdoc = BeanMethods.getBoxDoc(boxid)
				
				if(bdoc!=null){
					//var totop = bdoc.getItemValueString("AddNewToTop") == "1" ? true : false;
					ldoc = database.createDocument()
					ldoc.replaceItemValue("Form","Bookmark")
					ldoc.replaceItemValue("TabId", getTabIdFromBoxId(boxid))
					ldoc.replaceItemValue("BoxID",boxid)
					ldoc.replaceItemValue("UserId",getUserId())
					ldoc.replaceItemValue("Type","2")
					ldoc.replaceItemValue("Title",txt)
					ldoc.computeWithForm(false,false)
					ldoc.save()
					var newbmid = ldoc.getItemValueString("UniqueID")

					var v:java.util.Vector = bdoc.getItemValue("BookmarkOrder");
					if(!v.isEmpty()){
						if(!v.contains(newbmid)){
							v.add(0,newbmid)
							
							//if(totop){
							//}else{
							//	v.add(newbmid)	
								//}
							bdoc.replaceItemValue("BookmarkOrder",v)
							bdoc.computeWithForm(false,false)
							bdoc.save()
							database.getView("lookupkey").refresh()
						}
						
					}else{
						
						//if(totop){
							var v2 = BeanMethods.getAllBookmarksInBox(boxid);
							v2.add(0,newbmid)
							bdoc.replaceItemValue("BookmarkOrder",v2)
							bdoc.computeWithForm(false,false)
							bdoc.save()
						//
						database.getView("lookupkey").refresh()
						
					}
					return "txt created " + txt + " boxid " + boxid
				}
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "createQuickText Not Found"
		},
		saveTabSortOrder: function(pageid, order) {
			try{
				Logger.LogEvent("RPC saveTabSortOrder");

				var key = "Page_UNID_" + pageid;
				print(key)
				var ldoc = database.getView("LookupKey").getDocumentByKey(key,true)
				if(ldoc!=null){
					ldoc.replaceItemValue("TabOrder",order)
					ldoc.computeWithForm(false,false)
					ldoc.save()
					return "Tab order saved to page doc"
				}
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "Tab order ok " + key
			
		},
		saveBoxSortOrder: function(tabid,col1Order,col2Order,col3Order) {
			try{
				Logger.LogEvent("RPC saveBoxSortOrder");
				var key = "TAB_UNID_" + tabid;
				print(key)
				var ldoc = database.getView("LookupKey").getDocumentByKey(key,true)
				if(ldoc!=null){
					ldoc.replaceItemValue("BoxOrderCol1",col1Order)
					ldoc.replaceItemValue("BoxOrderCol2",col2Order)
					ldoc.replaceItemValue("BoxOrderCol3",col3Order)
					ldoc.replaceItemValue("BoxOrderCol4",col4Order)
					ldoc.replaceItemValue("BoxOrderCol5",col5Order)
					ldoc.computeWithForm(false,false)
					ldoc.save()
				}
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "box order ok"
		},
		saveBookmarkSortOrder: function(boxid, order) {
			try{
				Logger.LogEvent("RPC saveBookmarkSortOrder");
				
				var key = "Box_UNID_" + boxid;
				var ldoc = database.getView("LookupKey").getDocumentByKey(key,true)
				if(ldoc!=null){
					ldoc.replaceItemValue("BookmarkOrder",order)
					ldoc.computeWithForm(false,false)
					ldoc.save()
					return "bm sort order saved to box " + boxid
				}
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "saveBookmarkSortOrder Not Found"
		},
		saveBoxMinimized: function(boxid, x) {
			try{
				Logger.LogEvent("RPC saveBoxMinimized");
				
				var key = "Box_UNID_" + boxid;
				var ldoc = database.getView("LookupKey").getDocumentByKey(key,true)
				if(ldoc!=null){
					ldoc.replaceItemValue("Minimized",x)
					ldoc.computeWithForm(false,false)
					ldoc.save()
					return "Box minimized " + x
				}
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "saveBoxMinimized Not Found"
		},
		moveBookmarkToBox: function(bmid, fromboxid, toboxid) {
			try{
				
				Logger.LogEvent("RPC moveBookmarkToBox");
				
				var fromBoxDoc = BeanMethods.getBoxDoc(fromboxid)
				var toBoxDoc = BeanMethods.getBoxDoc(toboxid)
				var bmDoc = getBookmarkDoc(bmid)
				
				if(fromBoxDoc == null || toBoxDoc == null || bmDoc == null){
					return("Error moveBookmarkToBox")
				}
	
				// remove bookmark from box
				var v = fromBoxDoc.getItemValue("BookmarkOrder")
				if(!v.isEmpty()){
					if(v.contains(bmid)){
						v.remove(bmid)
						fromBoxDoc.replaceItemValue("BookmarkOrder",v)
						fromBoxDoc.computeWithForm(false,false)
						fromBoxDoc.save()	
					}
				}
				
				// add bookmark to box
				var v = toBoxDoc.getItemValue("BookmarkOrder")
				if(!v.isEmpty()){
					if(!v.contains(bmid)){
						v.add(bmid)
						toBoxDoc.replaceItemValue("BookmarkOrder",v)
						toBoxDoc.computeWithForm(false,false)
						toBoxDoc.save()	
					}
				}else{
					var v = BeanMethods.getAllBookmarksInBox(toboxid)
					v.add(bmid)
					toBoxDoc.replaceItemValue("BookmarkOrder",v)
					toBoxDoc.computeWithForm(false,false)
					toBoxDoc.save()	
				}
			
				// change the bookmark doc
				
				bmDoc.replaceItemValue("BoxID",toboxid)
				bmDoc.computeWithForm(false,false)
				bmDoc.save()	
				print("move ok")

				
			}catch(e){
				Logger.LogError(e.toString())
				print(e)
			}
			return "Moved Bookmark '" + getBookmarkTitle(bmid) + "' from box '" + BeanMethods.getBoxTitle(fromboxid) + "' to box '" + BeanMethods.getBoxTitle(toboxid) + "'"
		}
			
}