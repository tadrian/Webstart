var Admin = {
		ClearAllBoxColor: function() {
			var key = "BOX_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			dc.stampAll("HeaderTheme","")
			view.postScript("window.location.reload()");
		},
		CollapseAllBoxes: function() {
			var key = "BOX_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			dc.stampAll("Minimized","1")
			view.postScript("window.location.reload()");
		},
		ExpandAllBoxes: function(t) {
			var key = "BOX_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			dc.stampAll("Minimized","0")
			view.postScript("window.location.reload()");
		},
		ClearAllTabSorting: function() {
			var key = "TAB_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			var d = dc.getFirstDocument()
			while(d!=null){
				d.replaceItemValue("BoxOrderCol1","")
				d.replaceItemValue("BoxOrderCol2","")
				d.replaceItemValue("BoxOrderCol3","")
				d.replaceItemValue("BoxOrderCol4","")
				d.replaceItemValue("BoxOrderCol5","")
				d.computeWithForm(false,false)
				d.save()
				d = dc.getNextDocument(d)
			}
			view.postScript("window.location.reload()");
		},
		ClearAllBoxSorting: function() {
			var key = "BOX_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			var d = dc.getFirstDocument()
			while(d!=null){
				d.replaceItemValue("BookmarkOrder","")
				d.computeWithForm(false,false)
				d.save()
				d = dc.getNextDocument(d)
			}
			view.postScript("window.location.reload()");
		},
		ClearAllPageSorting: function() {
			var key = "PAGE_UID_" + getUserId();
			var dc:NotesDocumentCollection = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			var d = dc.getFirstDocument()
			while(d!=null){
				d.replaceItemValue("TabOrder","")
				d.computeWithForm(false,false)
				d.save()
				d = dc.getNextDocument(d)
			}
			view.postScript("window.location.reload()");
		},
		ToggleFavicon: function() {
			var userd = BeanMethods.getUserDoc();
			if(userd!=null){
				if(userd.getItemValueString("DisableFavIcons")=="1"){
					userd.replaceItemValue("DisableFavIcons","")
				}else{
					userd.replaceItemValue("DisableFavIcons","1")
				}
				userd.computeWithForm(false,false)
				userd.save()
				view.postScript("window.location.reload()");
			}
		}
}

			
/*			
<xe:basicLeafNode label="Clear all box colors"></xe:basicLeafNode>
			<xe:basicLeafNode label="Collapse all boxes"></xe:basicLeafNode>
			<xe:basicLeafNode label="Expand all boxes"></xe:basicLeafNode>
			<xe:basicLeafNode label="Expand all boxes"></xe:basicLeafNode>
			<xe:basicLeafNode label="Clear all box sorting"></xe:basicLeafNode>
			<xe:basicLeafNode label="Clear all tab sorting"></xe:basicLeafNode>
			<xe:basicLeafNode label="Clear all page sorting"></xe:basicLeafNode>


*/