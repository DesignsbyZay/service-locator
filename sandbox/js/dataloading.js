$(document).ready(function(){
	$.getJSON( "data/datasources.json", function( data ) {
		var listItemsHTML = processData(data);
		$("#content_leftpane").append(listItemsHTML);
	});
});

function processData(data) {
	var listItemsHTML = "<ul>";

  	$.each( data, function( key, val ) {
  		listItemsHTML += processItem(val);
  	});

  	listItemsHTML += "</ul>";
  	return listItemsHTML;
}

function processItem(item) {
	var itemHTML = ""; 

	var id = item.id;
	var name = item.name;
	var type = item.type;
	var itemText = name;
	if (item.url != null) {
		itemText = "<a href=\"#\" onclick=\"loadContents('" + item.url + "')\">" + name + "</a>";
	}

	itemHTML += "<li>" + itemText;

	if (item.contents != null) {
		itemHTML += "<ul>";
		$.each(item.contents, function(key, val) {
			itemHTML += processItem(val);
		});
		itemHTML += "</ul>";
	}

	itemHTML += "</li>";
	return itemHTML;
}


function loadContents(url) {
	$.getJSON(url, function (data) {
		$("#content_rightpane").html("<pre>" + JSON.stringify(data, null, '\t')) + "</pre>";
	});
}