ICONSIZE = 26;
BASECOORDS = [42, -73];

function makeMap() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    mymap = L.map('llmap').setView(BASECOORDS, 8);
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(mymap);

    icon = new L.icon({
            iconUrl: '/static/plane.png',
            shadowUrl: '/static/empty.png',

            iconSize:     [ICONSIZE, ICONSIZE], // size of the icon
            shadowSize:   [ICONSIZE, ICONSIZE], // size of the shadow
            iconAnchor:   [ICONSIZE/2, ICONSIZE/2], // point of the icon which will correspond to marker's location
            shadowAnchor: [ICONSIZE/2, ICONSIZE/2],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });


    O = new OwnShip( mymap );
    O.addPoint( BASECOORDS[0], BASECOORDS[1], 0, 0 );
    O.activateAim(30);
    
    setInterval( function() {
        var pt = O.getLatestPosition();
        O.addPoint(pt.lat + 0.025, pt.lon + 0.025, pt.rotation + 10, pt.time + 1);
        O.render(-1, 10);
        mymap.panTo([pt.lat + 0.025, pt.lon + 0.025, pt.rotation + 1]);
    } , 500);
   
}


// 4. animation



var layer = L.layerGroup();

function renderData(districtid) {
    $.getJSON("/district/" + districtid, function(obj) {
        var markers = obj.data.map(function(arr) {
            return L.marker([arr[0], arr[1]]);
        });
        mymap.removeLayer(layer);
        layer = L.layerGroup(markers);
        mymap.addLayer(layer);
    });
}

function move(m) {
    m.setRotation(m.getRotation()+10);
}


$(function() {
    makeMap();
})
