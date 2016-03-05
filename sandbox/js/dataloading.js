$(document).ready(function(){
	$.getJSON( "data/datasources.json", function( data ) {
		$("#content_leftpane").append("<ul>");
	  	$.each( data, function( key, val ) {
	  		processItem($("#content_leftpane ul"), val);
	  	});
		$("#content_leftpane").append("</ul>");
	});
});

function processItem(parentElement, item) {
	var id = item.id;
	var name = item.name;
	var type = item.type;
	var itemText = name;
	if (item.url != null) {
		itemText = "<a href=\"#\" onclick=\"loadContents('" + item.url + "')\">" + name + "</a>";
	}
	parentElement.append("<li>" + itemText + "</li>");

	if (item.type == "category") {
		parentElement.append("<ul>");
		$.each( item.contents, function(key, val) {
			processItem(parentElement.find("ul"), val);
		});
		parentElement.append("</ul>");
	}
}

function loadContents(url) {
	$.getJSON(url, function (data) {
		$("#content_rightpane").html("<pre>" + JSON.stringify(data, null, '\t')) + "</pre>";
	});
}