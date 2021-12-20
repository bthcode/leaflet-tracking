ICONSIZE   = 30;

class AOI {
    constructor(lat1, lon1, lat2, lon2, lat3, lon3, lat4, lon4, map_handle) {
        this.lat1 = lat1;
        this.lon1 = lon1;
        this.lat2 = lat2;
        this.lon2 = lon2;
        this.lat3 = lat3;
        this.lon3 = lon3;
        this.lat4 = lat4;
        this.lon4 = lon4;
        this.map_handle = map_handle;
    }
};

class TrackPoint {
    constructor( lat, lon, rotation, time ) {
        this.lat = lat;
        this.lon = lon;
        this.rotation = rotation;
        this.time = time;
    }
}

class Track {
    constructor( icon, map_handle ) {
        this.map_handle = map_handle;
        this.points = [];
        this.icon = icon;
        this.m = null; // marker graphics handle
        this.p = null; // line graphics handle
    }

    addPoint( lat, lon, rotation, time ) {
        this.points.push(new TrackPoint( lat, lon, rotation, time ));
    }

    render( at_time, duration ) {
        if (this.points.length == 0) {
            console.log('no points');
            return;
        }

        //---------------------------------
        // find track head
        //  - if at_time == -1 - use latest
        //  - else, find first >= at_time
        //---------------------------------
        var pt = this.points[this.points.length-1];
        
        // calc time bounds
        var max_time = at_time;
        if (at_time == -1 ) {
            max_time = pt.time;
        }
        var min_time = max_time - duration;
            
        var pts = []; 

        for (var i=0; i<this.points.length;i++) {
            var tp = this.points[i];
            if ((tp.time <= max_time) && (tp.time >=  min_time)) {
                pts.push( [tp.lat, tp.lon] );
            }

            if (tp.time >= max_time) {
                pt = tp;
                break;
            }
        }

        if (this.m === null) {
            this.m = new L.marker([pt.lat, pt.lon], {icon: this.icon}); //.addTo(this.map);
            this.m.addTo(this.map_handle);
        }
        if (this.p === null) {
            this.p = new L.polyline([]);
            this.p.addTo(this.map_handle);
        }

        // update main icon
        this.m.setLatLng([pt.lat, pt.lon]);
        this.m.setRotationAngle(pt.rotation);

        this.p.setLatLngs(pts);

    }


    unrender() {
        if (this.m !== null) {
            this.m.removeFrom(this.map_handle);
            this.m = null;
        }
        if (this.p !== null) {
            this.p.removeFrom(this.map_handle);
            this.p = null;
        }
    }

    getLatestPosition() {
        if (this.points.length == 0) {
            return null;
        }
        var pt = this.points[this.points.length-1];
        return pt;
    }
};

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


        this.map_handle = map_handle;
        this.track = new Track(this.icon, this.map_handle);
        this.sector = null; // target wedge
        this.sector_span = 0;
        this.render(-1, 10);
    }

    getPosition() {
        var pt = this.track.getLatestPosition();
        return [pt.lat, pt.lon, pt.rotation];
    } 

    setPosition(lat, lon, rotation, time) {
        this.track.addPoint(lat,lon,rotation,time);


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

    render( at_time, duration ) {
        this.track.render(at_time, duration);
    }

    unrender() {
        this.track.unrender();
        if (this.sector !== null)
        {
            this.sector.removeFrom(this.map_handle);
            this.sector = null;
        }
        
    }


};
