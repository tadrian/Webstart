
var User = {
		getUserBoxes: function(){
			
			var uid = getUserId();
			var key = "Box_UID_" + uid
			var dc = database.getView("LookupKey").getAllDocumentsByKey(key,true)
			
			var array = new java.util.ArrayList()
			var d = dc.getFirstDocument()
			while(d!=null){
				array.add(d.getItemValueString("Title") + "|" + d.getItemValueString("UniqueId"))
				d = dc.getNextDocument(d)
			}
			return array
		}
}

