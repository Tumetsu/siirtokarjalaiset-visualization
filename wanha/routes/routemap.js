"use strict";

var map;
function initialize() {
    // Create a simple map.
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 7,
        center: new google.maps.LatLng(62.244747, 25.747218400000065)
    });

    // Load a GeoJSON from the same server as our demo.
    map.data.loadGeoJson('http://localhost:3000/routes/personRoute_lines.geojson');
}

google.maps.event.addDomListener(window, 'load', initialize);