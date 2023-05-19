package com.consili;

import java.io.Serializable;
import java.io.*;
import java.util.*;
import lotus.domino.*;
import com.ibm.xsp.extlib.util.ExtLibUtil;


public class Bookmark implements Serializable {

	private static final long serialVersionUID = 1L;

	public Bookmark() throws NotesException {
	}

	private String unid;
	private DateTime created;
	private DateTime modified;
	private String title;
	private String url;
	private String code;
	private String codelang;
	private String markdown;
	private String usehtml;
	private String colortheme;
	private String textstyle;
	private String summary;
	private String userid;
	private String tabid;
	private String boxid;
	private String type;
	private String uniqueid;
	private Vector<String> key;
	private String body;

	
	public DateTime getCreated() {
		return created;
	}
	public void setCreated(DateTime Created) {
		this.created = Created;
	}
	public DateTime getModified() {
		return modified;
	}
	public void setModified(DateTime Modified) {
		this.modified = Modified;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String Title) {
		this.title = Title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String Url) {
		this.url = Url;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String Code) {
		this.code = Code;
	}
	public String getCodelang() {
		return codelang;
	}
	public void setCodelang(String Codelang) {
		this.codelang = Codelang;
	}
	public String getMarkdown() {
		return markdown;
	}
	public void setMarkdown(String Markdown) {
		this.markdown = Markdown;
	}
	public String getUsehtml() {
		return usehtml;
	}
	public void setUsehtml(String Usehtml) {
		this.usehtml = Usehtml;
	}
	public String getColortheme() {
		return colortheme;
	}
	public void setColortheme(String Colortheme) {
		this.colortheme = Colortheme;
	}
	public String getTextstyle() {
		return textstyle;
	}
	public void setTextstyle(String Textstyle) {
		this.textstyle = Textstyle;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String Summary) {
		this.summary = Summary;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String Userid) {
		this.userid = Userid;
	}
	public String getTabid() {
		return tabid;
	}
	public void setTabid(String Tabid) {
		this.tabid = Tabid;
	}
	public String getBoxid() {
		return boxid;
	}
	public void setBoxid(String Boxid) {
		this.boxid = Boxid;
	}
	public String getType() {
		return type;
	}
	public void setType(String Type) {
		this.type = Type;
	}
	public String getUniqueid() {
		return uniqueid;
	}
	public void setUniqueid(String Uniqueid) {
		this.uniqueid = Uniqueid;
	}
	public Vector<String> getKey() {
		return key;
	}
	public void setKey(Vector<String> Key) {
		this.key = Key;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String Body) {
		this.body = Body;
	}
	public String getUnid() {
		return unid;
	}
	public void setUnid(String unid) {
		this.unid = unid;
	}


}