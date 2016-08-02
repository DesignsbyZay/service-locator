var tv = null;
var mymap = null;
var markerLayers = new Object();

function serviceLocatorApp() {};

serviceLocatorApp.init = function() {
}

serviceLocatorApp.addLayer = function(nodedata) {
    console.log(JSON.stringify(nodedata, null, 4));
    $.getJSON(nodedata.url, function(data) {
        var markers = [];
        var markerIcon = L.icon({
            iconUrl: nodedata.icon
        })
        $.each(data, function(key, val) {
            var latitude = eval("val." + nodedata.latitudeElement);
            var longitude = eval("val." + nodedata.longitudeElement);
            var name = eval("val." + nodedata.nameElement);
            var marker = L.marker([latitude, longitude], {icon: markerIcon});
            var popupHTML = Mustache.render(nodedata.popupTemplate, val);
            marker.bindPopup(popupHTML);
            markers.push(marker);
        });
        var markerLayer = L.layerGroup(markers);
        markerLayer.addTo(mymap);
        markerLayers[nodedata.id] = markerLayer;
    })
}

serviceLocatorApp.removeLayer = function(nodedata) {
    console.log(JSON.stringify(nodedata, null, 4));
    if (markerLayers[nodedata.id] != 'undefined') {
        mymap.removeLayer(markerLayers[nodedata.id]);
    }
}

$( document ).ready(function() {

	// create treeview
    tv = new Treeview('jqxTree');
    tv.connectApp(serviceLocatorApp);

	// create map
    mymap = L.map('mapdiv').setView([37.524025, -122.265402], 11);

    L.tileLayer('https://api.mapbox.com/styles/v1/ggladman/ciqt360rb0000bdkorirtmd2x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2dsYWRtYW4iLCJhIjoiY2lxcTc2cW5qMDJpd2Z5bm52eGVqZjQycSJ9.qGpgl1ag6RqppBwGgp3m8Q', {
    // L.tileLayer('https://api.mapbox.com/styles/v1/ggladman/ciqt2sdkc0001bpmbrhse0yy1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2dsYWRtYW4iLCJhIjoiY2lxcTc2cW5qMDJpd2Z5bm52eGVqZjQycSJ9.qGpgl1ag6RqppBwGgp3m8Q', {
    // L.tileLayer('https://api.mapbox.com/styles/v1/ggladman/ciqq77vui004jbgm155r0bg9z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2dsYWRtYW4iLCJhIjoiY2lxcTc2cW5qMDJpd2Z5bm52eGVqZjQycSJ9.qGpgl1ag6RqppBwGgp3m8Q', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(mymap);

	// get treeview data
    $.ajax({
        type: "GET",
        url: "layers.csv",
        dataType: "text",
        success: function(data) {processCSVData(data);}
     });
});

function processCSVData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var mapObj = new Object();
            for (var j=0; j<headers.length; j++) {
                mapObj[headers[j]] = data[j];
            }
            lines.push(mapObj);
        }
    }

    $.each(lines, function(index, value) {
	    console.log(JSON.stringify(value,null,4));
        var nodeData = new Object();
        nodeData.id = index.toString();
        nodeData.url = value.url;
        nodeData.latitudeElement = value.latitudeElement;
        nodeData.longitudeElement = value.longitudeElement;
        nodeData.nameElement = value.nameElement;
        nodeData.icon = value.icon;
        nodeData.popupTemplate = value.popupTemplate;
	    tv.addNode(index.toString(), value.name, value.parent, nodeData);
    })

}