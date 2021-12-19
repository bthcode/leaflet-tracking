BASECOORDS = [42, -73];
ICONSIZE   = 30;


function makeMap() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    mymap = L.map('llmap').setView(BASECOORDS, 8);
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(mymap);


    // Make a plne
    var planeIcon = L.icon({
        iconUrl: '/static/plane.png',
        shadowUrl: '/static/empty.png',

        iconSize:     [ICONSIZE, ICONSIZE], // size of the icon
        shadowSize:   [ICONSIZE, ICONSIZE], // size of the shadow
        iconAnchor:   [ICONSIZE/2, ICONSIZE/2], // point of the icon which will correspond to marker's location
        shadowAnchor: [ICONSIZE/2, ICONSIZE/2],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let m = L.marker(BASECOORDS, {icon: planeIcon}); //.addTo(this.map);

    // rotates an icon - note html has to include rotation
    m.setRotationAngle(-72);

    // draw donut
    let sector = L.sector({
        center: mymap.getCenter(),
        innerRadius:  50000,
        outerRadius: 100000,
        startBearing: m.getRotationAngle() + 90-45/2,
        endBearing: m.getRotationAngle() + 90+45/2,
        fill: true,
        fillColor: '#cc00cc',
        fillOpacity: 0.5,
        color: '#000000',
        opacity: 1.0
    });

      var polylinePoints = [
        BASECOORDS,
        [ BASECOORDS[0] + 0.1, BASECOORDS[1] + 0.1 ],
        [ BASECOORDS[0] + 0.2, BASECOORDS[1] + 0.2 ]
      ];          
    
    p = L.polyline(polylinePoints);

    layer = L.layerGroup([m, sector, p]);
    mymap.addLayer(layer);
    
    sector.on('click', function() {
        sector.setFillColor('#00cc00');
    });

    setInterval( function() {
        m.setRotationAngle(m.getRotationAngle() + 10);
        sector.setStartBearing(m.getRotationAngle() + 90-45/2);
        sector.setEndBearing(m.getRotationAngle() + 90+45/2);
        sector._setLatLngs(sector.getLatLngs());

    } , 500);

    return [ mymap, m, sector, p ];
    
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
    var map_stuff = makeMap();
    mymap = map_stuff[0]; 
    marker = map_stuff[1];
    sector = map_stuff[2];
    tail   = map_stuff[3];
})
