function getViewAsString(exclude:string) {
	var retStr = "<hr/><b>Component Tree</b><pre>";
	retStr += getComponentAsString(view, 0, exclude);
	retStr += "</pre>";
	return retStr;
}

function getComponentAsString(component:javax.faces.component.UIComponent, level:int, exclude:string) {
	var retStr = "";
	var id = component.getId();
	if (id == exclude) {
		return retStr;
	}
	for (i=0; i<level; i++) {
		retStr += "&nbsp;";
	}
	if (level > 0) {
		var filePath = database.getFilePath();
		retStr += "<img src='/" + filePath + "/descend.gif'>";
	}
	retStr += component.getClass().getSimpleName();
	if (id != null) {
		retStr += " [id:" + id;
		try {
			retStr += " clientId:" + getClientId(id);
		}
		catch (e) {
		}
		retStr += "]";
	}
	retStr += "<br/>"
	
	var facetsAndChildren = component.getFacetsAndChildren();
	retStr += getComponentsAsString(facetsAndChildren, level + 1, exclude);
	
	return retStr;
}

function getComponentsAsString(children:java.util.Iterator, level:int, exclude:string) {
	var retStr = "";
	while (facetsAndChildren.hasNext()) {
		retStr += getComponentAsString(facetsAndChildren.next(), level, exclude)
	}
	return retStr;
}