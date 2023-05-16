package com.consili;

import com.ibm.xsp.extlib.util.ExtLibUtil;


import java.util.ArrayList;
import java.util.Map;
import java.util.Vector;

import javax.faces.context.FacesContext;
import javax.servlet.http.Cookie;

import org.json.JSONObject;
import com.paulwithers.openLog.*;

import lotus.domino.*;

public class BeanMethods {

	private static final long serialVersionUID = 1L;
	public Database db;
	public ArrayList<String> tabDocs;
	public Session session;

	public String userid;
	public String sessionid;

	private ArrayList<String> userTabs;
	public ArrayList<String> userBoxes;
//	private OpenLogErrorHolder oli = new OpenLogErrorHolder();
	
	public BeanMethods() throws NotesException {
		userid = getUserId();
		tabDocs = new ArrayList<String>();
		userTabs = new ArrayList<String>();
		userBoxes= new ArrayList<String>();
		this.loadNewUserSession();
	}
	
	public DocumentCollection getAllDocsByKey(String key) throws NotesException {
		String sessionID = getSessionID();
		db = ExtLibUtil.getCurrentDatabase();
		return db.getView("LookupKey").getAllDocumentsByKey(key,true);
	}
	
	public void loadNewUserSession() throws NotesException {
		this.setSessionID();
		this.setUserId();
		this.setUserBoxes();
		this.setUserTabs();
	}
	
	public String getSessionID() {
		return this.sessionid;
	}
	public String setSessionID() {
		Map<String, Cookie> cookieMap = FacesContext.getCurrentInstance().getExternalContext().getRequestCookieMap();
		for (Cookie cookie : cookieMap.values()) {
			if (cookie.getName().equals("session")) {
				sessionid = cookie.getValue();
			}
		}
		return "";
	}

	
	public String getUserId() {
		return this.userid;
	}
	
	public void setUserId() throws NotesException {
		String sessionID = getSessionID();
		db = ExtLibUtil.getCurrentDatabase();
		if (!sessionID.isEmpty()) {
			View v = db.getView("LookupKey");
			Document ud = v.getDocumentByKey("User_SID_" + sessionID, true);
			if (ud != null) {
				this.userid = ud.getItemValueString("UniqueID");
			}
			ud.recycle();
		}
	}
	public Document getUserDoc() throws NotesException {
		String sessionID = getSessionID();
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		Document ud = vv.getDocumentByKey("User_SID_" + sessionID, true);
		return ud;
	}
	
	public String TypeAheadSearch(String query) throws NotesException {

		try {
			db = ExtLibUtil.getCurrentDatabase();
			View searchView = db.getView("Search");
			ViewEntryCollection nvec = searchView.getAllEntriesByKey(this.userid, false);
			nvec.FTSearch(query + "*");

			if (nvec.getCount() == 0) {
				return "<ul><li class=\"listitem\">No hits</li></ul>";
			}

			ViewEntry entry = nvec.getFirstEntry();
			int resultCount = 0;

			StringBuilder sb = new StringBuilder();
			sb.append("<ul style='margin:0px'>");
			while (entry != null) {

				Document mdoc = entry.getDocument();
				String tp = mdoc.getItemValueString("Type");
				String url = mdoc.getItemValueString("Url");
				String boxid = mdoc.getItemValueString("BoxId");
				String tabid = mdoc.getItemValueString("Tabid");
				String summary = mdoc.getItemValueString("Summary");
				String title = mdoc.getItemValueString("Title");
				String boxTitle = getBoxTitle(boxid);
				String tabTitle = getTabTitle(tabid);
				// var contb =
				// com.ibm.xsp.acf.StripTagsProcessor.instance().processMarkup(conta);
				String summaryb = com.ibm.xsp.acf.StripTagsProcessor.instance.processMarkup(summary);

				sb.append("<li class=\"listitem\"><table style='width:400px'><tr><td>");
				if (tp.equals("1")) {
					sb.append("<i class='fa fa-share' style='margin-right:5px'></i>" + tabTitle + " / " + boxTitle
							+ " / <a href='" + url + "' target='_blank'>Open " + title + "</a>");
				} else if (tp.equals("2")) {
					sb.append("<i class='fa fa-edit' style='margin-right:5px'></i>" + tabTitle + " / " + boxTitle
							+ " / " + title);
				} else if (tp.equals("3")) {
					url = "";
					sb.append("<i class='fa fa-edit' style='margin-right:5px'></i>" + tabTitle + " / " + boxTitle
							+ " / <a href='" + url + "' target='_blank'>Open " + title + "</a>");
				}
				sb.append("</td></tr></table></li>");
				resultCount++;
				if (resultCount > 9) {
					entry = null; // limit the results to first 10 found
				} else {
					ViewEntry tmp = entry;
					entry = nvec.getNextEntry(entry);
					tmp.recycle();
				}
			}

			sb.append("</ul>");
			nvec.recycle();
			return sb.toString();

		} catch (Exception e) {
			Logger.LogError(e.toString());
			return e.toString();
		}
	}

	
	
	public String Search(String query) throws NotesException {

		try {
			db = ExtLibUtil.getCurrentDatabase();
			View searchView = db.getView("Search");
			ViewEntryCollection nvec = searchView.getAllEntriesByKey(this.userid, false);
			nvec.FTSearch(query + "*");

			if (nvec.getCount() == 0) {
				return "<ul><li class=\"listitem\">No hits</li></ul>";
			}

			ViewEntry entry = nvec.getFirstEntry();
			int resultCount = 0;

			StringBuilder sb = new StringBuilder();

			while (entry != null) {

				Document mdoc = entry.getDocument();
				String tp = mdoc.getItemValueString("Type");
				String url = mdoc.getItemValueString("Url");
				String boxid = mdoc.getItemValueString("BoxId");
				String tabid = mdoc.getItemValueString("Tabid");
				String summary = mdoc.getItemValueString("Summary");
				String title = mdoc.getItemValueString("Title");
				String boxTitle = getBoxTitle(boxid);
				String tabTitle = getTabTitle(tabid);
				// var contb =
				// com.ibm.xsp.acf.StripTagsProcessor.instance().processMarkup(conta);
				String summaryb = com.ibm.xsp.acf.StripTagsProcessor.instance.processMarkup(summary);

				sb.append("<ul class=\"listitems\">");
				if (tp.equals("1")) {
					sb.append(
							"<li class='col1'><i class='fa fa-share' style='margin-right:5px'></i></li><li class='col2'>"
									+ tabTitle + " </li><li class='col3'> " + boxTitle
									+ " </li><li class='col4'> <a href='" + url + "' target='_blank'>Open " + title
									+ "</a></li>");
				} else if (tp.equals("2")) {
					// sb.append("<i class='fa fa-edit'
					// style='margin-right:5px'></i>" + tabTitle + " / " +
					// boxTitle + " / " + title);
					sb.append(
							"<li class='col1'><i class='fa fa-share' style='margin-right:5px'></i></li><li class='col2'>"
									+ tabTitle + " </li><li class='col3'> " + boxTitle
									+ " </li><li class='col4'> <a href='" + url + "' target='_blank'>Open " + title
									+ "</a></li>");

				} else if (tp.equals("3")) {
					url = "";
					sb.append(
							"<li class='col1'><i class='fa fa-share' style='margin-right:5px'></i></li><li class='col2'>"
									+ tabTitle + " </li><li class='col3'> " + boxTitle
									+ " </li><li class='col4'> <a href='" + url + "' target='_blank'>Open " + title
									+ "</a></li>");

					// sb.append("<i class='fa fa-edit'
					// style='margin-right:5px'></i>" + tabTitle + " / " +
					// boxTitle + " / <a href='" + url + "' target='_blank'>Open
					// " + title + "</a>");
				}
				sb.append("</ul>");
				resultCount++;
				if (resultCount > 9) {
					entry = null; // limit the results to first 10 found
				} else {
					ViewEntry tmp = entry;
					entry = nvec.getNextEntry(entry);
					tmp.recycle();
				}

			}

			sb.append("</ul>");
			nvec.recycle();
			return sb.toString();

		} catch (Exception e) {
			Logger.LogError(e.toString());
			return e.toString();
		}
	}

	public Document getTabDocFromBoxId(String boxid) throws NotesException {
		Document boxd = this.getBoxDoc(boxid);
		String tabid = boxd.getItemValueString("TabID");
		return getTabDoc(tabid);
	}

	public String getTabIdFromBoxId(String boxid) throws NotesException {
		Document boxd = this.getBoxDoc(boxid);
		String tabid = boxd.getItemValueString("TabID");
		return tabid;
	}

	public String getTabTitle(String tabid) throws NotesException {

		db = ExtLibUtil.getCurrentDatabase();
		Document d = db.getView("lookupkey").getDocumentByKey("Tab_UNID_" + tabid, true);
		if (d != null) {
			return d.getItemValueString("Title");
		}
		return "-";

	}

	public ArrayList<String> getUserBoxes() throws NotesException {
		return userBoxes;
	}

	public ArrayList<String> setUserBoxes() throws NotesException {

		userBoxes.clear();
		db = ExtLibUtil.getCurrentDatabase();
		String key = "Box_UID_" + this.userid;
		DocumentCollection dc = db.getView("LookupKey").getAllDocumentsByKey(key, true);
		
		Document d = dc.getFirstDocument();
		while (d != null) {
			String boxTitle = d.getItemValueString("Title");
			String tabTitle = this.getTabTitle(d.getItemValueString("TabId"));
			userBoxes.add(tabTitle + " \\ " + boxTitle + "|" + d.getItemValueString("UniqueId"));
			Document temp = d;
			d = dc.getNextDocument(d);
			temp.recycle();
		}

		// Sort the array
		java.util.Collections.sort(userBoxes, new java.util.Comparator<String>() {
			@Override
			public int compare(String s1, String s2) {
				String key1 = s1.substring(0, s1.indexOf("|"));
				String key2 = s2.substring(0, s2.indexOf("|"));
				return key1.compareTo(key2);
			}
		});
		dc.recycle();
		return userBoxes;
	}

	public ArrayList<String> getUserTabs() throws NotesException {
		/*
		  if (userTabs.isEmpty()) {
		 
			userTabs = getUserTabs2();
		}
		*/
		return userTabs;
	}

	public ArrayList<String> setUserTabs() throws NotesException {

		this.userTabs.clear();
		db = ExtLibUtil.getCurrentDatabase();
		String key = "TAB_UID_" + this.userid;
		DocumentCollection dc = db.getView("LookupKey").getAllDocumentsByKey(key, true);

		Document d = dc.getFirstDocument();
		while (d != null) {
			String tabTitle = d.getItemValueString("Title");
			userTabs.add(tabTitle + "|" + d.getItemValueString("UniqueId"));
			Document temp = d;
			d = dc.getNextDocument(d);
			temp.recycle();
		}
		dc.recycle();
		return userTabs;

	}

	public Document getBoxDoc(String boxid) throws NotesException {
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		String tkey = "Box_UNID_" + boxid;
		return vv.getDocumentByKey(tkey, true);
	}

	public Document getTabDoc(String tabid) throws NotesException {
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		String tkey = "Tab_UNID_" + tabid;
		return vv.getDocumentByKey(tkey, true);
	}

	public String getBoxTitle(String boxid) throws NotesException {
		return this.getBoxDoc(boxid).getItemValueString("Title");
	}

	public Boolean isOutOfOrder(String boxid) throws NotesException {

		System.out.println("Test1");
		db = ExtLibUtil.getCurrentDatabase();
		Document boxd = this.getBoxDoc(boxid);
		java.util.Vector<String> v = boxd.getItemValue("BookmarkOrder");
		ViewEntryCollection nvec = db.getView("lookupkey").getAllEntriesByKey("Bookmark_BoxID_" + boxid, true);
		
		if (v.size() > 0 && v.size() != nvec.getCount()) {
			nvec.recycle();
			return true;
		}
		nvec.recycle();
		return false;
	}

	public void moveBoxToNewTab(String boxid, String oldtabid, String newtabid) throws NotesException {
		try {
			
			Logger.LogEvent(boxid + " - " + oldtabid + " - " + newtabid);
			System.out.println(boxid + " - " + oldtabid + " - " + newtabid);
			db = ExtLibUtil.getCurrentDatabase();
			Document oldTabdoc = this.getTabDoc(oldtabid);
			Vector<String> v1 = (Vector<String>) oldTabdoc.getItemValue("BoxOrderCol1");
			Vector<String> v2 = (Vector<String>) oldTabdoc.getItemValue("BoxOrderCol2");
			Vector<String> v3 = (Vector<String>) oldTabdoc.getItemValue("BoxOrderCol3");
			Vector<String> v4 = (Vector<String>) oldTabdoc.getItemValue("BoxOrderCol4");
			Vector<String> v5 = (Vector<String>) oldTabdoc.getItemValue("BoxOrderCol5");

			Boolean upd = false;
			int colupd = 0;
			if (v1.contains(boxid)) {
				v1.remove(boxid);
				oldTabdoc.replaceItemValue("BoxOrderCol1", v1);
				upd = true;
				colupd = 1;
			}
			if (v2.contains(boxid)) {
				v2.remove(boxid);
				oldTabdoc.replaceItemValue("BoxOrderCol2", v2);
				upd = true;
				colupd = 2;
			}
			if (v3.contains(boxid)) {
				v3.remove(boxid);
				oldTabdoc.replaceItemValue("BoxOrderCol3", v3);
				upd = true;
				colupd = 3;
			}
			if (v4.contains(boxid)) {
				v4.remove(boxid);
				oldTabdoc.replaceItemValue("BoxOrderCol4", v4);
				upd = true;
				colupd = 4;
			}
			if (v5.contains(boxid)) {
				v5.remove(boxid);
				oldTabdoc.replaceItemValue("BoxOrderCol5", v5);
				upd = true;
				colupd = 5;
			}
			if (upd) {
				oldTabdoc.computeWithForm(false, false);
				oldTabdoc.save();
			}

			// add the box to the new tab, always add to first column as the use
			// bay only have one column in the targetbox
			Document newTabdoc = this.getTabDoc(newtabid);
			Vector<String> vx = newTabdoc.getItemValue("BoxOrderCol1");
			vx.add(boxid);
			newTabdoc.replaceItemValue("BoxOrderCol1", vx);
			newTabdoc.computeWithForm(false, false);
			newTabdoc.save();

			Document boxdoc = this.getBoxDoc(boxid);
			boxdoc.replaceItemValue("TabId", newtabid);
			boxdoc.computeWithForm(false, false);
			boxdoc.save();

		} catch (Exception e) {
			Logger.LogError(e.toString());
		}

	}

	public Document getBookmarkDoc(String bmid) throws NotesException {
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		String tkey = "Bookmark_UNID_" + bmid;
		return vv.getDocumentByKey(tkey, true);

	}

	public void moveBookmarkToNewBox(String bmid, String oldboxid, String newboxid) throws NotesException {
		try {
			db = ExtLibUtil.getCurrentDatabase();

			if (bmid.isEmpty())
				return;
			if (newboxid.isEmpty())
				return;
			if (oldboxid.isEmpty())
				return;
			if (oldboxid.isEmpty())
				return;

			Document oldboxd = this.getBoxDoc(oldboxid);
			Document newboxd = this.getBoxDoc(newboxid);
			Document bookmd = this.getBookmarkDoc(bmid);

			String oldtabid = getTabIdFromBoxId(oldboxid);
			String newtabid = getTabIdFromBoxId(newboxid);

			bookmd.replaceItemValue("TabId", newtabid);
			bookmd.replaceItemValue("BoxId", newboxid);
			bookmd.computeWithForm(false, false);
			bookmd.save();

			Vector<String> bvNew = newboxd.getItemValue("BookmarkOrder");
			if (!bvNew.isEmpty()) {
				if (!bvNew.contains(bmid)) {
					bvNew.add(bmid);
					newboxd.replaceItemValue("BookmarkOrder", bvNew);
					newboxd.computeWithForm(false, false);
					newboxd.save();
					;
				}
			} else {
				// the new box does not currently have a sort order, we need to
				// add it.
				Vector<String> v = this.getAllBookmarksInBox(newboxid);
				newboxd.replaceItemValue("BookmarkOrder", v);
				newboxd.computeWithForm(false, false);
				newboxd.save();
			}

			Vector<String> bvOld = oldboxd.getItemValue("BookmarkOrder");
			if (!bvOld.isEmpty()) {
				if (bvOld.contains(bmid)) {
					bvOld.remove(bmid);
					oldboxd.replaceItemValue("BookmarkOrder", bvOld);
					oldboxd.computeWithForm(false, false);
					oldboxd.save();
				}
			}

		} catch (Exception e) {
			Logger.LogError(e.toString());
		}
	}

	public Vector<String> getAllBookmarksInBox(String boxid) throws NotesException {

		db = ExtLibUtil.getCurrentDatabase();
		Vector v = new java.util.Vector();
		String key = "Bookmark_BOXID_" + boxid;
		ViewEntryCollection nvec = db.getView("LookupKey").getAllEntriesByKey(key, true);
		ViewEntry entry = nvec.getFirstEntry();
		while (entry != null) {
			v.add(entry.getDocument().getItemValueString("UniqueId"));
			ViewEntry temp = entry;
			entry = nvec.getNextEntry(entry);
			temp.recycle();
		}
		nvec.recycle();
		return v;
	}

	public static Vector<String> mergeVectors(Vector<String> v1, Vector<String> v2) {
		Vector<String> result = new Vector<String>();
		int i = 0;
		int j = 0;
		while (i < v1.size() && j < v2.size()) {
			if (v1.get(i) == v2.get(j)) {
				result.add(v1.get(i));
				i++;
				j++;
			} else {
				result.add(v2.get(j));
				j++;
			}
		}
		while (j < v2.size()) {
			result.add(v2.get(j));
			j++;
		}
		return result;
	}

	public ArrayList<String> getTabDocs() throws NotesException {
		if (tabDocs.isEmpty()) {
			tabDocs = getTabDocs2();
		}
		return tabDocs;
	}
	public ArrayList<String> getTabDocs2() throws NotesException{
		
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		String userid = this.userid;
		
		
		Vector<String> tabSortOrder = this.getPageDoc().getItemValue("TabOrder");
		if(!tabSortOrder.isEmpty()){
			for(int i=0;i<tabSortOrder.size();i++){
				String key = "Tab_UNID_" + tabSortOrder.get(i); 		
				ViewEntry entry = vv.getEntryByKey(key,true);
				if(entry!=null){
					tabDocs.add(entry.getNoteID());
				}
			}
			return tabDocs;
		}else{
			String key = "Tab_UID_" + userid;
			return org.openntf.Utils.Dblookup(db,"lookupkey",new org.openntf.Utils.Params(true,true,true,key, "1"));
			
		}
			
	}
	
	public Document getPageDoc() throws NotesException{
		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		String userid = this.userid;
		String tkey = "Page_UID_" + userid;
		return vv.getDocumentByKey(tkey, true);
	}
	

	
	public DocumentCollection getColumnBoxes(String tabid, String sortOrderField, int columnNo) throws NotesException{

		db = ExtLibUtil.getCurrentDatabase();
		View vv = db.getView("LookupKey");
		vv.refresh();
		String userid = this.userid;

		String tkey = "TAB_UNID_" + tabid;
		Document tabd = vv.getDocumentByKey(tkey, true);
		Vector<String> boxsortorder = tabd.getItemValue(sortOrderField);
		Vector<String> sortorder = tabd.getItemValue("BoxOrder");

		if(!sortorder.isEmpty()){
			
			DocumentCollection dcx = db.createDocumentCollection();
			for(int i=0;i<boxsortorder.size();i++){
				String key = "Box_UNID_" + boxsortorder.get(i); 		
				Document docx = vv.getDocumentByKey(key,true);
				if(docx!=null){
					if(!dcx.contains(docx)){
						dcx.addDocument(docx);
					}
				}
			}
			return dcx;

		}else{
			return null;
		}
	}
	
	public ArrayList<String> getTabs(String view, String key, String column) throws NotesException{
		
		//db = ExtLibUtil.getCurrentDatabase();
		return org.openntf.Utils.Dblookup(db,view,new org.openntf.Utils.Params(true,true,true,key, column));
		//return session.evaluate("@DbLookup('';'';'" + key + "';'" + key + "';" + column + "')");
	}
	
	public String[] getValuesFromDbLookup(String view, String key, String column) {
	        
			String[] result = null;
	       	session = ExtLibUtil.getCurrentSessionAsSignerWithFullAccess();
	    
	        try {

	        	// Construct the formula for the @DbLookup
	            StringBuilder formulaBuilder = new StringBuilder();
	            formulaBuilder.append("@DbLookup(\"\";\"\";\"");
	            formulaBuilder.append(view);
	            formulaBuilder.append("\";\"");
	            formulaBuilder.append(key);
	            formulaBuilder.append("\";");
	            formulaBuilder.append(column);
	            formulaBuilder.append(")");

	            // @DbLookup("";"";"lookupkey";"bookmark";2)
	            
	            // Evaluate the formula and get the result as a Java object
	            Object evalResult = session.evaluate(formulaBuilder.toString());
	            System.out.println(formulaBuilder.toString());
	            // Check if the result is an array of strings
	            if (evalResult instanceof Object[]) {
	                Object[] evalArray = (Object[]) evalResult;
	                result = new String[evalArray.length];

	                // Convert each element to a string and store it in the result array
	                for (int i = 0; i < evalArray.length; i++) {
	                    result[i] = evalArray[i].toString();
	                }
	            }
	        } catch (NotesException e) {
	        	Logger.LogError(e.toString());
	        }

	        return result;
	    }
	
	
	// get user tabs on ccaPageContent
	public Object getTabCollection() {
		try{
		
			db = ExtLibUtil.getCurrentDatabase();
			View vv = db.getView("LookupKey");
			String userid = this.userid;
			Vector tabSortOrder = this.getPageDoc().getItemValue("TabOrder");
			if(!tabSortOrder.isEmpty()){
				DocumentCollection dcx = db.createDocumentCollection();
				for(int i=0;i<tabSortOrder.size();i++){
					String key = "Tab_UNID_" + tabSortOrder.get(i); 		
					Document docx = vv.getDocumentByKey(key,true);
					if(docx!=null){
						if(!dcx.contains(docx)){
							dcx.addDocument(docx);
						}
					}
				}
				return dcx;
	
			}else{
				
				String key = "Tab_UID_" + userid;
				return db.getView("LookupKey").getAllEntriesByKey(key,true);
			}
			
		}catch(Exception e){
			Logger.LogError(e.toString());
		}
		return null;
	}
	
	// get box content  on ccaBoxContent
	public Object getBoxContent(Document boxd) {
		try{
		
			db = ExtLibUtil.getCurrentDatabase();
			View vv = db.getView("LookupKey");
			String userid = this.userid;
			String boxid = boxd.getItemValueString("UniqueID");
			Vector bookmarkSortOrder = boxd.getItemValue("BookmarkOrder");
	
			if(!bookmarkSortOrder.isEmpty()){
				ArrayList<String> ar = new ArrayList<String>();
				//DocumentCollection dcx = db.createDocumentCollection();
				for(int i=0;i<bookmarkSortOrder.size();i++){
					String key = "Bookmark_UNID_" + bookmarkSortOrder.get(i); 		
					Document docx = vv.getDocumentByKey(key,true);
					if(docx!=null){
						ar.add(docx.getUniversalID());
						//if(!dcx.contains(docx)){
							//dcx.addDocument(docx);
						//}
					}
				}
				return ar;
	
			}else{
				String key = "Bookmark_BOXID_" + boxid;
				//ViewEntryCollection nvec =  vv.getAllEntriesByKey(key,true);
				ViewNavigator  nav = vv.createViewNavFromCategory(key);
				return this.getUnidArray(nav);
			}
		}catch(Exception e){
			Logger.LogError(e.toString());
		}
		return null;
	}
	
	
	public ArrayList<String> getUnidArray(DocumentCollection dc) throws NotesException{
		ArrayList<String> ar = new ArrayList<String>();
		db = ExtLibUtil.getCurrentDatabase();
		Document d = dc.getFirstDocument();
		Document tmpd = null;
		while(d!=null){
			
			ar.add(d.getUniversalID());
			tmpd = d;
			d = dc.getNextDocument(d);
			tmpd.recycle();
		}
		return ar;
		
	}
	
	public ArrayList<String> getUnidArray(ViewEntryCollection dc) throws NotesException{
		ArrayList<String> ar = new ArrayList<String>();
		db = ExtLibUtil.getCurrentDatabase();
		ViewEntry entry = dc.getFirstEntry();
		ViewEntry tmpentry = null;
		while(entry !=null){
			
			ar.add(entry.getUniversalID());
			tmpentry = entry;
			entry = dc.getNextEntry(entry);
			tmpentry.recycle();
		}
		return ar;
		
	}
	
	public ArrayList<String> getUnidArray(ViewNavigator nav) throws NotesException{
		ArrayList<String> ar = new ArrayList<String>();
		db = ExtLibUtil.getCurrentDatabase();
		ViewEntry entry = nav.getFirst();
		while (entry != null) {
			ar.add(entry.getUniversalID());
			entry = nav.getNext(entry);
		}
		return ar;
	}
	
}
