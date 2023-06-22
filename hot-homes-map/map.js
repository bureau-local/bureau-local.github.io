// ------ SET UP BASE TILES ------
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 2,
	maxNativeZoom: 19,
	maxZoom: 22,
	attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	id: 'osm.mapnik'
});

// Set Up The Map
//	Prevent zooming out too far
var map = L.map('map', {
	minZoom: 12, // original setting: 12
});

//	If map was shared and the URl has lat/long/zoom - then go to the location
map.on("load", function () {
	if (window.location.hash != "") {
		if(window.location.hash.indexOf("/") > -1)
		{
			var hashArray = window.location.hash.substr(1).split("/");
			if(hashArray.length >= 2)
			{
				var hashLat = hashArray[0];
				var hashLng = hashArray[1];
				var hashZoom = 16; if(hashArray[2] != void 0){hashZoom = hashArray[2];}
				map.setView([hashLat, hashLng], hashZoom);
			}
		}
	}
});

//	Bounds to restrict view to specific area
//	http://bboxfinder.com/#51.472767,-0.104741,51.496552,-0.039166
var southWest = L.latLng(51.47, -0.11),
northEast = L.latLng(51.5, -0.03),
bounds = L.latLngBounds(southWest, northEast);

map.setView([51.48, -0.07], 13.5).setMaxBounds(bounds);

// ------ ADD MAP TILES ------
OpenStreetMap_Mapnik.addTo(map);

// ------ ADD HOT HOMES AREA POLYGON ------
var hotHomesArea = L.polygon([hotHomesPolygon.coordinates], {
    color: '#917393',
    fillColor: '#917393',
    fillOpacity: 0.4,
}).addTo(map);
