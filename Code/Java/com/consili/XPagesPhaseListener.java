package com.consili;

import java.io.ByteArrayInputStream;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ibm.xsp.extlib.util.ExtLibUtil;
import com.ibm.xsp.http.io.output.ByteArrayOutputStream;

import lotus.domino.Database;
import lotus.domino.cso.Document;
import java.io.Serializable;
public class XPagesPhaseListener implements javax.faces.event.PhaseListener {
 
      private static final long serialVersionUID = 1L;
     
 
    public PhaseId getPhaseId() {
         return PhaseId.ANY_PHASE;
    }
      
    public void beforePhase(PhaseEvent event) {
    	long millis = System.currentTimeMillis();
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    	String formatted = sdf.format(new Date(millis));
    	
        System.out.println(formatted + " START PHASE " + event.getPhaseId());
    
        /*
        Map<String, Object> r = FacesContext.getCurrentInstance().getExternalContext().getRequestMap();
    	Map<String, Object> sessScope = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
    	for (Map.Entry<String, Object> entry : r.entrySet()) {
    	    System.out.println("R Key: " + entry.getKey() + ", Value: " + entry.getValue());
    	}
    	
    	for (Map.Entry<String, Object> entry : sessScope.entrySet()) {
    	    System.out.println("S Key: " + entry.getKey() + ", Value: " + entry.getValue());
    	}
    	*/
    	
    }
 
    public void afterPhase(PhaseEvent event) {
    	
    	long millis = System.currentTimeMillis();
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    	String formatted = sdf.format(new Date(millis));
    	System.out.println(formatted + " END PHASE " + event.getPhaseId());
      
        
    }

	
 
}