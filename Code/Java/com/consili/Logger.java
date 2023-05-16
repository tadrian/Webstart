package com.consili;
import java.io.Serializable;
import javax.faces.context.FacesContext;
import lotus.domino.*;
import com.ibm.xsp.extlib.util.ExtLibUtil;


public class Logger implements Serializable {

	private static final long serialVersionUID = 1L;

	public static void LogError(String err){
		
		Database db = ExtLibUtil.getCurrentDatabase();
		try {
			Document doc = db.createDocument();
			doc.replaceItemValue("Form","Log");
			doc.replaceItemValue("Error","1");
			doc.replaceItemValue("LogMessage", "Logger Error " + err);
			doc.save();
			
		} catch (NotesException ne) {
			ne.printStackTrace();
		}
	}
	
	
	public static void LogEvent(String txt){

		Database db = ExtLibUtil.getCurrentDatabase();
		try {
			Document doc = db.createDocument();
			doc.replaceItemValue("Form","Log");
			doc.replaceItemValue("LogMessage","Logger msg: " +  txt);
			doc.save();
			
		} catch (NotesException ne) {
			ne.printStackTrace();
		}
	}
	
	
	
}
