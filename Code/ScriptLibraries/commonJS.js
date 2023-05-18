var debugMode = false;

// this enables everything, it is called from partial refresh via hijack, 
function activateAll(){
	activateTabs();
	sortTabs();
	sortColumns();
	sortItems();
	activeCollapseExpand();
	activateTabClickHash()
	Prism.highlightAll();
	
	$(".portlet").addClass("ui-widget").find(".portlet-header").addClass("ui-widget-header ui-corner-all");
	$(".portlet").addClass("ui-widget ui-widget-content")
	$("[id$='portletwrapper']").find(".portlet").addClass("ui-widget ui-widget-content")
}

XSP.addOnLoad(function() {
});




$(function() {

	var id = $("[id$='dynC']").attr("id")
	x$(id).append("<div>hold on, getting your data...</div>")
	XSP.showContent(id,"bm")
	
	$(window).on('focus', function() {
		//keepSessionAlive()
	})
	activateAll();
	
	$(".portlet").addClass(
			"ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
			.find(".portlet-header").addClass("ui-widget-header ui-corner-all");
	//enableSortableBoxesWhenActive()
	/*
	var dropdownMenu = $('.dropdown-menu');
    var items = [
        {text: 'Item 1', url: '#'},
        {text: 'Item 2', url: '#'},
        {text: 'Item 3', url: '#'}
    ];
    $.each(items, function(index, item) {
        var listItem = $('<li>');
        var link = $('<a>').attr('href', item.url).text(item.text);
        listItem.append(link);
        dropdownMenu.append(listItem);
    });
    $('.dropdown-toggle').click(function(e) {
        e.preventDefault();
        $(this).next('.dropdown-menu').toggleClass('show');
    });
    */
	  
});


function activateTabClickHash(){
	$("#tabs").on("click", "a", function(event) {
		 //event.preventDefault();
		if(debugMode) console.log("tab click")
		 var tabId = $(event.currentTarget).attr("href");
		 window.location.hash = tabId;
		 $('html, body').scrollTop(0);
	})	
}

function refreshPage(id){
	
	if(debugMode) console.log("Refreshpage " + id)
	setTimeout(function() {
		XSP.partialRefreshGet(id,{
			 onComplete: function (){
				 if(debugMode) console.log("oncomplete");
				 //activateAll()
	        },
	        onStart: function () {
	       	 if(debugMode) console.log("onstart");
	        },
	        onError: function () {
	        	if(debugMode) console.log("onerror");  
	        	logError("refreshPage error for id: " + id)
	        }
		});
		return true;
	}, 300);
}

function refreshPage2(){
	alert("used?")
	setTimeout(function() {
		var id = $("[id$='portletwrapper']")
		XSP.partialRefreshGet(id,{
			 onComplete: function (){
				console.log("Running")
			 	activateTabs();
			 	sortTabs();
			 	sortColumns()
			 	sortItems();
			 	//hljs.highlightAll();
			 	$("[id$='portletwrapper']").find(".portlet").addClass("ui-widget ui-widget-content")
	        },
	        onStart: function () {
	       	 if(debugMode) console.log("onstart");
	        },
	        onError: function () {
	        	if(debugMode) console.log("onerror");  
	        	logError("refreshPage2 error for id: " + id)
	        }
		});
		return true;
	}, 300);
}

function keepSessionAlive(){
	var id = $("[id$='keepSessionAlive']").attr("id");
    XSP.partialRefreshPost(id, {
        onError: function() { 
        	$("[id$='timeoutbox']").show()
        },
    	onComplete: function (){
    		if(debugMode) console.log("complete")
    	},
    	onError: function () {
	        if(debugMode) console.log("onerror");  
	        logError("keepSessionAlive error for id " + id)
	    }
    });
}

function activeCollapseExpand() {
	  // Check if the event is already added before adding it - poe.com
	  if (!$('.toggle').data('events') || !$('.toggle').data('events').click) {
	    $('.toggle').on('click', function() {
	      var icon = $(this);
	      var p = icon.closest('.portlet');
	      console.log('portlet id=' + $(p).attr('id'));
	      icon.toggleClass('fa-chevron-up fa-chevron-down');
	      p.find('.portlet-content').toggle();
	      var x = icon.hasClass('fa-chevron-down') ? '0' : '1';
	      var pid = p.attr('id');
	      postBoxMinimized(pid, x);
	    });
	  }
}

function activeCollapseExpandOld(){
	$(".toggle").on("click", function() {
		var icon = $(this);
		var p = icon.closest(".portlet")
		console.log("portelt id=" + $(p).attr("id"))
		
		icon.toggleClass("fa-chevron-up fa-chevron-down");
		p.find(".portlet-content").toggle();
		var x = icon.hasClass("fa-chevron-down") ? "0" : "1"
		var pid = p.attr("id")
		postBoxMinimized(pid, x);
	});
}

function sortItems(){
	
	var receivedItemId = "";
	var receivedBoxId = "";
	var removedItemId = "";
	var removedBoxId = "";
	var receivedOrder = "";
	var recList = [];
	
	// Enable sorting of bookmarks in box
	$(".sortableItems").sortable({
		//cancel : ".contenttext",
		cancel : ".BookmarkTitle, .contenttext",
		connectWith : ".sortableItems",
		placeholder : "pholder",
		items:"li",
		helper : "clone",
		forcePlaceholderSize : true,
		receive : function(event, ui) {
			if(debugMode)console.log("bm receive" + $(this).sortable("toArray"))
			receivedItemId = ui.item.attr("bmid");
			receivedBoxId = $(this).attr("boxid");
			receivedOrder = $(this).sortable("toArray");
			for (var i = 0; i < receivedOrder.length; i++) {
				if(debugMode) console.log($(receivedOrder[i]).attr("bmid"));
				recList.push($(receivedOrder[i]).attr("bmid"));
			}
		},
		remove : function(event, ui) {
			if(debugMode)console.log("bm remove")
			removedItemId = ui.item.attr("bmid");
			removedBoxId = $(this).attr("boxid");

			if(debugMode)console.log("Removed item ID: " + removedItemId + " from boxid: " + removedBoxId)
		},
		update : function(event, ui) {
			if(debugMode) console.log("bm update")
			//			console.log("sortableItems update boxid: " + $(this).attr("boxid"))
			//			console.log("array: " + $(this).sortable("toArray"));
		},
		stop : function(event, ui) {
			if(debugMode) console.log("bm stop")
			var boxid = $(this).attr("boxid");
			var array = $(this).sortable("toArray");
			if(debugMode)console.log("LOG = " + array);
			var arrayList = [];
			for (var i = 0; i < array.length; i++) {
				//if(debugMode)console.log(i + " " + x$(array[i]).text())
				arrayList.push(x$(array[i]).attr("bmid"));
			}
			if(debugMode)console.table(arrayList);
			if (removedBoxId != receivedBoxId) {
				moveBookmarkToBox(receivedItemId, removedBoxId, receivedBoxId);
				//postBookmarkOrderToBox(receivedBoxId, recList);
			} else {
				postBookmarkOrderToBox(boxid, arrayList);
			}
	
			// we must always refresh bref after any drag, if not the edit menu will not work
			var refid = $("[id$='bref']").attr("id");
			refreshPage(refid)
		},
		start : function(event, ui) {
			if(debugMode)console.log("bm start")
			$("pholder").css('display', 'block');
		}

	});
}

function sortColumns(){
	$(".column").sortable(
			{
				items:".portlet",
				connectWith : ".column",
				handle : ".portlet-header",
				cancel : ".contenttext",
				 
				//placeholder: "ui-state-highlight",
				placeholder : "portlet-placeholder ui-corner-all",
				receive : function(event, ui) {
					if(debugMode)console.log("column receive")
				},
				remove : function(event, ui) {
					if(debugMode)console.log("column remove")
				},
				update : function(event, ui) {
					if(debugMode)console.log("column update")
					// Get the active tab ID
					var activeTab = $(".ui-tabs-active").attr("tabid");
					// Get the sort order of each column in the active tab
					if(debugMode)console.log("Active tab " + activeTab)
					//logSortOrder(activeTab)
					//var allSortOrders = getAllSortOrders(activeTab);
					
					
					// When dragging a box, get the sortorder for the current tab, 3 arrays, 1 for each column
					var allSortOrders = [];
					$("#" + activeTab + " .column").each(function() {
						var columnSortOrder = $(this).sortable("toArray");
						allSortOrders.push(columnSortOrder);
					});
					
					if(debugMode)console.table(allSortOrders)
					var column1SortOrder = allSortOrders[0];
					var column2SortOrder = allSortOrders[1];
					var column3SortOrder = allSortOrders[2];
					var column4SortOrder = allSortOrders[3];
					var column5SortOrder = allSortOrders[4];
					//console.log("1 " + column1SortOrder)
					//console.log("2 " + column2SortOrder)
					//console.log("3 " + column3SortOrder)
					postBoxOrderToTab(activeTab, column1SortOrder,column2SortOrder, column3SortOrder,column4SortOrder,column5SortOrder);

					
				},
				stop : function(event, ui) {
					 var sortableItems = {};
					    $(".column").each(function() {
					      var columnId = $(this).attr("id");
					      var portletIds = $(this).find(".portlet").map(function() {
					        return $(this).attr("id");
					      }).get();
					      sortableItems[columnId] = portletIds;
					    });
					    if(debugMode)console.table(sortableItems)
					    var refid = $("[id$='bref']").attr("id");
					    refreshPage(refid)
				},
				start : function(event, ui) {
					if(debugMode)console.log("column start")
				}
			});
}

function sortTabs(){
	$(".sortableTabs").sortable({
		receive : function(event, ui) {
			if(debugMode)console.log("sortableTabs receive")
		},
		remove : function(event, ui) {
			if(debugMode)console.log("sortableTabs remove")
		},
		update : function(event, ui) {
			if(debugMode)console.log("sortableTabs update")
		},
		stop : function(event, ui) {
			var pageid = $(this).attr("pageid");
			//console.log("pageid" + pageid)
			var array = $(this).sortable("toArray");
			//console.log(array.toString());
			var arrayList = [];
			for (var i = 0; i < array.length; i++) {
				arrayList.push(x$(array[i]).attr("tabid"));
			}
			if(debugMode)console.table(arrayList);
			postTabOrderToPage(pageid, arrayList);
			
			var refid = $("[id$='bref']").attr("id");
			refreshPage(refid)
		}
	});
}

function activateTabs(){
	$("#tabs").tabs({
		activate : function(event, ui) {
			var activeTab = $(ui.newPanel).attr("id");
			var sortOrder = $("#" + activeTab + " .column").sortable("toArray");
			var allSortOrders = getAllSortOrders(activeTab);
			for (var i = 0; i < allSortOrders.length; i++) {
				var columnSortOrder = allSortOrders[i];
				if(debugMode)console.log("Sort order of column " + (i + 1) + " in active tab: " + columnSortOrder.join(","));
			}
		},
		//active: localStorage.getItem("activeTab"),
		heightStyle : "fill"
	});
}



function logSortOrder(activeTab) {
	var allSortOrders = getAllSortOrders(activeTab);
	for (var i = 0; i < allSortOrders.length; i++) {
		var columnSortOrder = allSortOrders[i];
		if(debugMode)console.log("Sort order of column " + (i + 1) + " in active tab: " + columnSortOrder.join(","));
	}
}

function getAllSortOrders(tabId) {
	var allSortOrders = [];
	$("#" + tabId + " .column").each(function() {
		var columnSortOrder = $(this).sortable("toArray");
		columnSortOrder.splice(0, 1) // remove the computedfield
		if(debugMode)console.log(columnSortOrder)
		allSortOrders.push(columnSortOrder);
	});
	return allSortOrders;
}

function enableSortableBoxesWhenActive() {
	$("#tabs").tabs(
			{
				activate : function(event, ui) {
					var panelId = ui.newPanel.attr('id');
					var activeTab = $(ui.newPanel).attr("id");
					var sortOrder = $("#" + activeTab + " .column").sortable(
							"toArray");
					if(debugMode)console.log("SO= " + sortOrder);

					//window.location.hash = '#' + panelId;
					ui.newPanel.find(".sortable").sortable({
						stop : function(event, ui) {
							var tabid = $(this).attr("tabid");
							var array = $(this).sortable("toArray");
							var arrayList = [];
							for (var i = 0; i < array.length; i++) {
								arrayList.push(x$(array[i]).attr("boxid"));
							}
							postBookmarkOrder(tabid, arrayList);

							if(debugMode)console.log(arrayList);
							if(debugMode)console.log("tabid: " + tabid);
						}
					});
				}
			});

}

function enableSortableTabs() { 

	$(".sortable").disableSelection();
}

function logError(txt) {
	actions.logError(txt).addCallback(function(response) {
		if(debugMode)console.log("RESPONSE logerror: " + response)
	})
}


//createQuickText
function createQuickText(boxid, txt) {
	actions.createQuickText(boxid, txt).addCallback(function(response) {
		if(debugMode)console.log("RESPONSE Quicktext: " + response)
	})
}

// box save minimized
function postBoxMinimized(boxid, minimized) {
	actions.saveBoxMinimized(boxid, minimized).addCallback(function(response) {
		if(debugMode)console.log("RESPONSE MINIMIZED " + response)
	})
}

// RPC TAB 
function postTabOrderToPage(pageid, order) {
	actions.saveTabOrder(pageid, order).addCallback(function(response) {
		if(debugMode)console.log("RESPONSE TAB TO PAGE " + response)
	})
}

// RPC BOX 
function postBoxOrderToTab(tabid, col1, col2, col3, col4, col5) {
	actions.saveBoxOrder(tabid, col1, col2, col3, col4, col5).addCallback(
			function(response) {
				if(debugMode)console.log(response)
			})
}

// RPC BM 
function postBookmarkOrderToBox(boxid, order) {
	actions.saveBookmarkOrder(boxid, order).addCallback(function(response) {
		if(debugMode)console.log(response)
	})
}

// RPC BM Move
function moveBookmarkToBox(bmid, fromboxid, toboxid) {
	actions.moveBookmarkToBox(bmid, fromboxid, toboxid).addCallback(
			function(response) {
				if(debugMode)console.log(response)
			})
}

function showSortedData(sortable_order) {
	$("#sortable").html("");
	for (var i = 0; i < sortable_order.length; i++) {
		if(debugMode)console.log(sortable_order[i])
		$("#sortable").append(x$("#" + sortable_order[i]));
	}
}

function getBookmarkOrder() {
	$.ajax({
		type : "GET",
		url : "./bookmarkorder",
		contentType : "application/text",
		success : function(response) {
			showSortedData(response.split(","));
			if(debugMode)console.log(sortable_order.length)
		},
		error : function(xhr, status, error) {
			if(debugMode)console.log(status);
		}
	});
}

function postBookmarkOrderx(order) {
	$.ajax({
		type : "POST",
		url : "./bookmarkorder",
		data : order,
		contentType : "application/text",
		dataType : "text",
		success : function(response) {
			sortable_order = response
			if(debugMode)console.log(response);
		},
		error : function(xhr, status, error) {
			if(debugMode)console.log(status);
			postBookmarkOrderx
		}
	});
}

function x$(idTag, param) { //Updated 18 Feb 2012
	idTag = idTag.replace(/:/gi, "\\:") + (param ? param : "");
	return ($("#" + idTag));
}

function extractLastNumber(str) {
	var matches = str.match(/(\d+)(?!.*\d)/);
	return matches ? parseInt(matches[1]) : null;
}

function downloadFavicon(url) {
	// Make an XMLHttpRequest to retrieve the favicon as a binary string
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url + '/favicon.ico', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function() {
		// Convert the binary string to a base64-encoded string
		var binary = '';
		var bytes = new Uint8Array(xhr.response);
		for (var i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		var base64 = btoa(binary);

		// Create an image element and set its src attribute to the base64-encoded string
		var img = document.createElement('img');
		img.src = 'data:image/x-icon;base64,' + base64;
		document.body.appendChild(img);
	};
	xhr.send();
}

function getCurrentAppPath(){
    // Extract path with replica id or nsf path
    return document.location.pathname.replace( /^(\/([0-9a-f]{16})|(.+\.nsf)).*/i, '$1/' );
}