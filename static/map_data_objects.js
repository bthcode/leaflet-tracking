ICONSIZE   = 30;


class OwnShip {
    constructor(lat,lon,rotation,map_handle) {
        // Make an icon
        this.icon = new L.icon({
            iconUrl: '/static/plane.png',
            shadowUrl: '/static/empty.png',

            iconSize:     [ICONSIZE, ICONSIZE], // size of the icon
            shadowSize:   [ICONSIZE, ICONSIZE], // size of the shadow
            iconAnchor:   [ICONSIZE/2, ICONSIZE/2], // point of the icon which will correspond to marker's location
            shadowAnchor: [ICONSIZE/2, ICONSIZE/2],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        this.lat = lat;
        this.lon = lon;
        this.rotation = rotation;
        this.map_handle = map_handle;
        this.m = null; // target icon on screen
        this.sector = null; // target wedge
        this.sector_span = 0;
        this.points = [] // points at time
        this.render();
    }

    getPosition() {
        return [this.lat, this.lon, this.rotation];
    } 

    setPosition(lat, lon, rotation) {
        this.lat = lat;
        this.lon = lon;
        this.rotation = rotation;

        if (this.m === null) {
            return;
        }

        // update main icon
        this.m.setLatLng([this.lat, this.lon]);
        this.m.setRotationAngle(rotation);

        // update aim sector
        if (this.sector !== null) {
            this.sector.setCenter([this.lat, this.lon]);
            this.sector.setStartBearing(rotation + 90 - this.sector_span/2);
            this.sector.setEndBearing(rotation + 90 + this.sector_span/2);
            this.sector.setLatLngs();
        }
    }

    activateAim(span) {
        this.sector_span = span;
        if (this.sector === null) {
            // draw donut
            this.sector = new L.sector({
                center: [this.lat, this.lon],
                innerRadius:  50000,
                outerRadius: 100000,
                startBearing: this.rotation + 90 -this.sector_span/2,
                endBearing: this.rotation + 90 +this.sector_span/2,
                fill: true,
                fillColor: '#cc00cc',
                fillOpacity: 0.5,
                color: '#000000',
                opacity: 1.0
            });
        }
        this.sector.addTo(this.map_handle);
    }

    deactivateAim() {
        if (this.sector != null) {
            this.sector.removeFrom(this.map_handle);
        }
        this.sector = null;
    }

    render(map) {
        this.initializeGUI();
    }

    unrender() {
        console.log('unrender');
        if (this.m !== null)
        {
            console.log('removing m');
            this.m.removeFrom(this.map_handle);
            this.m = null;
        }
        if (this.sector !== null)
        {
            this.sector.removeFrom(this.map_handle);
            this.sector = null;
        }
        
    }

    initializeGUI() {
        this.unrender();
            
        this.m = new L.marker([this.lat, this.lon], {icon: this.icon}); //.addTo(this.map);

        // rotates an icon - note html has to include rotation
        this.m.setRotationAngle(this.rotation);

        this.m.addTo(this.map_handle)
    }
};
