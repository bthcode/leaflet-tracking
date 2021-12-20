BASECOORDS = [42, -73];

function makeMap() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    mymap = L.map('llmap').setView(BASECOORDS, 8);
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(mymap);

    let O = new OwnShip( BASECOORDS[0], BASECOORDS[1], 25, mymap );
    O.activateAim(30);

     setInterval( function() {
        pos = O.getPosition();
        O.setPosition(pos[0], pos[1]+0.01, pos[2] + 10);
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
