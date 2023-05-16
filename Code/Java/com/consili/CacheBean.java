package com.consili;

import java.io.Serializable;

import java.util.ArrayList;
import java.util.HashMap;

import com.ibm.xsp.extlib.util.ExtLibUtil;
import lotus.domino.*;


public class CacheBean implements Serializable {
    
	private static final long serialVersionUID = 1L;
	private HashMap<String, ArrayList<String>> userBoxes = new HashMap<String, ArrayList<String>>();

    public ArrayList<String> getUserBoxes(String user) throws NotesException {
        if (userBoxes.containsKey(user)) {
            return userBoxes.get(user);
        } else {
        	ArrayList<String> result = setUserBoxes(user);
        	userBoxes.put(user, result);
            return userBoxes.get(user);
        }
    }

    private ArrayList<String> setUserBoxes(String user) throws NotesException {
    	
    	ArrayList<String> ub = new ArrayList<String>();
    	Database db = ExtLibUtil.getCurrentDatabase();
    	String key = "Box_UID_" + user;
    	ViewNavigator nav = db.getView("LookupKey").createViewNavFromCategory(key);
		ViewEntry entry = nav.getFirst();
		while (entry != null) {
			ub.add(entry.getNoteID());
			ViewEntry temp = entry;
			entry = nav.getNext(entry);
			temp.recycle();
		}
		nav.recycle();
		return ub;
    }
}