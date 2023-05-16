package com.consili;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.github.rjeschke.txtmark.*;

public class MarkDown {

	
	private static final long serialVersionUID = 1L;
	
	public String markDownToHtml(String txt){
		
		//String result = Processor.process("This is some code:\n\n    code_line(1);", new PrettyPrintDecorator());	
		String htmlResult =  Processor.process(txt);
		String htmlresult2 =  processHtml(htmlResult);
		return htmlresult2;
	}
	
	 public String processHtml(String html) {
	        Document doc = Jsoup.parse(html);
	        
	        // Add "h1class" to each h1 tag
	        Elements h1Tags = doc.select("h1");
	        for (Element h1Tag : h1Tags) {
	            h1Tag.addClass("mdH1");
	        }
	        
	        // Add "h2class" to each h2 tag
	        Elements h2Tags = doc.select("h2");
	        for (Element h2Tag : h2Tags) {
	            h2Tag.addClass("mdH2");
	        }

	        Elements h3Tags = doc.select("h3");
	        for (Element h3Tag : h3Tags) {
	            h3Tag.addClass("mdH3");
	        }
	        
	        Elements ATags = doc.select("a");
	        for (Element ATag : ATags) {
	            ATag.addClass("mdA");
	        }
	        
	        return doc.html();
	  }
		
}

class PrettyPrintDecorator implements Decorator {
	
	/*
	  public String openCodeBlock() {
	    return "<code class=\"prettyprint\">";
	  }
	  public String closeCodeBlock() {
	    return "</code>";
	  }
	  
	 */
	@Override
	public void closeBlockquote(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeCodeBlock(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeCodeSpan(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeEmphasis(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeHeadline(StringBuilder arg0, int arg1) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeImage(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeLink(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeListItem(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeOrderedList(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeParagraph(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeStrong(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeSuper(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void closeUnorderedList(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void horizontalRuler(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openBlockquote(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openCodeBlock(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openCodeSpan(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openEmphasis(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openHeadline(StringBuilder arg0, int arg1) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openImage(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openLink(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openListItem(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openOrderedList(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openParagraph(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openStrong(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openSuper(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void openUnorderedList(StringBuilder arg0) {
		// TODO Auto-generated method stub
		
	}
}

