package org.openntf;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Vector;
import java.util.regex.Pattern;

import javax.faces.context.FacesContext;

import lotus.domino.Database;
import lotus.domino.NotesException;
import lotus.domino.Session;
import lotus.domino.View;
import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;
import lotus.domino.ViewNavigator;

/**
 * UPDATE 16 feb 2013 update code so it support multivalues in view columns
 * (dbcolumn) and fields (dblookup) UPDATE 14 feb 2013 added various tweaks
 * thanks to Karsten Lehmann and Ulrich Krause
 *
 *
 * @author Ferry Kranenburg 2013
 *
 *         This class is inspired by Tom Steenbergen's class for SSJS
 *         http://openntf.org/XSnippets.nsf/snippet.xsp?id=dblookup-dbcolumn-with-cache-sort-and-unique
 *
 *
 *
 ***********************************
 *         Dblookup - java version including cache,sort and unique, key,
 *         fieldname/colnr functionality
 *********************************
 *
 *         from (Java)/SSJS you can call this function e.g. (get all unique,
 *         sorted states from all documents) return
 *         org.openntf.Utils.Dblookup(database,"AllNames",new
 *         org.openntf.Utils.Params(true,true,true,"", "State")); or (get all
 *         values from second column where key=Abby) return
 *         org.openntf.Utils.Dblookup(database,"AllNames",new
 *         org.openntf.Utils.Params(true,true,true,"Abby", "1"));
 *
 *********************************
 *         Dbcolumn - java version including categoryfilter,cache,sort and
 *         unique functionality
 *********************************
 *
 *
 *         from (Java)/SSJS you can call this function e.g. return
 *         org.openntf.Utils.Dbcolumn(database,"AllNames",1,new
 *         org.openntf.Utils.Params(true,true,true,"myCategory")); or return
 *         org.openntf.Utils.Dbcolumn(database,"AllNames",1); // without
 *         cache,sort,categoryfilter and unique
 *
 *         The Params object is a helper class to easy pass params from java
 *
 */
@SuppressWarnings("unchecked")
public class Utils implements Serializable {

	private static final long serialVersionUID = -5577520390584674902L;

	/**
	 * Dbcolumn - Java version of @Dbcolumn sort = false unique = false cache =
	 * false
	 * 
	 * @param db
	 * @param viewname
	 * @param columnnr
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dbcolumn(Database db, String viewname, int columnNr) throws NotesException {
		return DbcolumnCore(db, viewname, columnNr, new Params());
	}

	/**
	 * Dbcolumn - Java version of @Dbcolumn uses Params object
	 * 
	 * @param db
	 * @param viewname
	 * @param columnNr
	 * @param params
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dbcolumn(Database db, String viewname, int columnNr, Params params)
			throws NotesException {
		return DbcolumnCore(db, viewname, columnNr, params);
	}

	/**
	 * Dbcolumn - Java version of @Dbcolumn sort = false unique = false cache =
	 * false
	 * 
	 * @param server
	 * @param dbpath
	 * @param viewname
	 * @param columnNr
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dbcolumn(String server, String dbpath, String viewname, int columnNr)
			throws NotesException {
		Database db = getSession().getDatabase(server, dbpath);
		return DbcolumnCore(db, viewname, columnNr, new Params());
	}

	/**
	 * Dbcolumn - Java version of @Dbcolumn uses Params object
	 * 
	 * @param server
	 * @param dbpath
	 * @param viewname
	 * @param columnNr
	 * @param params
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dbcolumn(String server, String dbpath, String viewname, int columnNr, Params params)
			throws NotesException {
		Database db = getSession().getDatabase(server, dbpath);
		return DbcolumnCore(db, viewname, columnNr, params);
	}

	/**
	 * DbcolumnCore - private core function of @dbcolumn
	 * 
	 * @param db
	 * @param viewname
	 * @param columnnr
	 * @param params
	 * @return
	 * @throws NotesException
	 */
	private static ArrayList<String> DbcolumnCore(Database db, String viewname, int columnNr, Params params)
			throws NotesException {
		// generate cachekey
		String cachekey = Utils.replaceAll("dbc_" + db.getFilePath() + "_" + viewname + "_" + String.valueOf(columnNr),
				" ", "_");

		// caching = if the results are already cached, get them
		if (params.isCache()) {
			if (Utils.sessionScope().containsKey(cachekey)) {
				return (ArrayList<String>) Utils.sessionScope().get(cachekey);
			}
		}

		View vw = db.getView(viewname);
		ViewNavigator vwnav = null;
		ViewEntry vwentry = null;
		ViewEntry vwentrytmp = null;

		// all results will be added to this
		ArrayList<String> results = new ArrayList<String>();

		// disable autoupdate
		vw.setAutoUpdate(false);

		// create viewnavigator
		if (params.getCategory().equals("")) {
			vwnav = vw.createViewNav();
		} else {
			vwnav = vw.createViewNavFromCategory(params.getCategory());
		}

		// setting buffer for fast view retrieval
		vwnav.setBufferMaxEntries(400);

		// peform lookup
		vwentry = vwnav.getFirst();
		while (vwentry != null) {
			results.add(vwentry.getColumnValues().elementAt(columnNr).toString());

			// Get entry and go recycle
			vwentrytmp = vwnav.getNext(vwentry);
			vwentry.recycle();
			vwentry = vwentrytmp;

		}

		// sorting
		if (params.isSort()) {
			results = Utils.sort(results);
		}
		// unique
		if (params.isUnique()) {
			results = Utils.unique(results);
		}
		// caching
		if (params.isCache()) {
			Utils.sessionScope().put(cachekey, results);
		}

		// enable autoupdate
		vw.setAutoUpdate(true);

		return results;
	}

	/**
	 * Dblookup - Java version of @Dblookup uses Params object
	 * 
	 * @param db
	 * @param viewname
	 * @param params
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dblookup(Database db, String viewname, Params params) throws NotesException {
		return DblookupCore(db, viewname, params);
	}

	/**
	 * Dblookup - Java version of @Dblookup sort = false unique = false cache =
	 * false
	 * 
	 * @param db
	 * @param viewname
	 * @param params
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dblookup(String server, String dbpath, String viewname, String key,
			String returnfield) throws NotesException {
		Database db = getSession().getDatabase(server, dbpath);

		Params params = new Params();
		params.setKey(key);
		params.setReturnfield(returnfield);

		return DblookupCore(db, viewname, params);
	}

	/**
	 * Dblookup - Java version of @Dblookup sort = false unique = false cache =
	 * false
	 * 
	 * @param db
	 * @param viewname
	 * @param key
	 * @param returnfield
	 * @return ArrayList<String> with lookup results
	 * @throws NotesException
	 */
	public static ArrayList<String> Dblookup(Database db, String viewname, String key, String returnfield)
			throws NotesException {
		Params params = new Params();
		params.setKey(key);
		params.setReturnfield(returnfield);

		return DblookupCore(db, viewname, params);
	}

	/**
	 * DblookupCore - private core function of @dblookup
	 * 
	 * @param db
	 * @param viewname
	 * @param params
	 * @return
	 * @throws NotesException
	 */
	private static ArrayList<String> DblookupCore(Database db, String viewname, Params params) throws NotesException {
		// generate cachekey
		String cachekey = Utils.replaceAll(
				"dbl_" + db.getFilePath() + "_" + viewname + "_" + params.getKey() + "_" + params.getReturnfield(), " ",
				"_");

		// caching = if the results are already cached, get them
		if (params.isCache()) {
			if (Utils.sessionScope().containsKey(cachekey)) {
				return (ArrayList<String>) Utils.sessionScope().get(cachekey);
			}
		}

		View vw = db.getView(viewname);
		ViewEntryCollection vwcoll = null;
		ViewEntry vwentry = null;
		ViewEntry vwentrytmp = null;

		// all results will be added to this
		ArrayList<String> results = new ArrayList<String>();

		// disable autoupdate
		vw.setAutoUpdate(false);

		// create viewnavigator
		if (params.getKey().equals("")) {
			vwcoll = vw.getAllEntries();
		} else {
			vwcoll = vw.getAllEntriesByKey(params.getKey(), true);
		}

		// peform lookup
		vwentry = vwcoll.getFirstEntry();
		while (vwentry != null) {
			if (Utils.isNumber(params.getReturnfield())) {
				// return field is column number
				Object values = vwentry.getColumnValues().elementAt(Integer.parseInt(params.getReturnfield()));
				if (values instanceof String) {
					results.add(values.toString());
				} else {
					results.addAll((Vector<String>) values);
				}
			} else {
				// return field is fieldname, only add if it exist on document
				if (vwentry.getDocument().hasItem(params.getReturnfield()) == true) {
					results.addAll(vwentry.getDocument().getItemValue(params.getReturnfield()));
				}
			}

			// Get entry and go recycle
			vwentrytmp = vwcoll.getNextEntry(vwentry);
			vwentry.recycle();
			vwentry = vwentrytmp;
		}

		// sorting
		if (params.isSort()) {
			results = Utils.sort(results);
		}
		// unique
		if (params.isUnique()) {
			results = Utils.unique(results);
		}
		// caching
		if (params.isCache()) {
			Utils.sessionScope().put(cachekey, results);
		}

		// enable autoupdate
		vw.setAutoUpdate(true);

		return results;
	}

	/**
	 * Params object is a helper class for passing params to DbColumn and
	 * DbLookup functions
	 *
	 * @author Ferry Kranenburg 2013
	 *
	 *
	 */
	public static class Params implements Serializable {
		private static final long serialVersionUID = 610176852544247762L;
		private boolean sort = false;
		private boolean cache = false;
		private boolean unique = false;
		private String category = "";
		private String returnfield = "";
		private String key = "";

		// constuctor
		public Params() {
		}

		// full constructor for dbcolumn
		public Params(boolean sort, boolean cache, boolean unique, String category) {
			this.setSort(sort);
			this.setCache(cache);
			this.setUnique(unique);
			this.setCategory(category);
		}

		// full constructor for dblookup
		public Params(boolean sort, boolean cache, boolean unique, String key, String returnfield) {
			this.setSort(sort);
			this.setCache(cache);
			this.setUnique(unique);
			this.setReturnfield(returnfield);
			this.setKey(key);
		}

		public void setSort(boolean sort) {
			this.sort = sort;
		}

		public boolean isSort() {
			return sort;
		}

		public void setCache(boolean cache) {
			this.cache = cache;
		}

		public boolean isCache() {
			return cache;
		}

		public void setUnique(boolean unique) {
			this.unique = unique;
		}

		public boolean isUnique() {
			return unique;
		}

		public void setCategory(String category) {
			this.category = category;
		}

		public String getCategory() {
			return category;
		}

		public void setReturnfield(String field) {
			this.returnfield = field;
		}

		public String getReturnfield() {
			return returnfield;
		}

		public void setKey(String key) {
			this.key = key;
		}

		public String getKey() {
			return key;
		}
	}

	private static Session getSession() {
		FacesContext context = FacesContext.getCurrentInstance();
		return (Session) context.getApplication().getVariableResolver().resolveVariable(context, "session");
	}

	private static Map<String, Object> sessionScope() {
		FacesContext context = FacesContext.getCurrentInstance();
		return (Map<String, Object>) context.getApplication().getVariableResolver().resolveVariable(context,
				"sessionScope");
	}

	private static ArrayList<String> sort(ArrayList<String> input) {
		Collections.sort(input);
		return input;
	}

	private static ArrayList<String> unique(ArrayList<String> input) {
		return new ArrayList<String>(new LinkedHashSet<String>(input));
	}

	private static String replaceAll(String input, String matchingStr, String replacementStr) {
		return input.replaceAll(Pattern.quote(matchingStr), replacementStr);
	}

	private static boolean isNumber(String input) {
		try {
			Integer.parseInt(input);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}

}
