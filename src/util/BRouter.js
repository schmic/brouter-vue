/*
 * Parameters for the BRouter URL:
 *
 * lonlats = lon,lat|... (unlimited list of lon,lat waypoints separated by |)
 * nogos = lon,lat,radius|... (optional, radius in meters)
 * profile = profile file name without .brf
 * alternativeidx = [0|1|2|3] (optional, default 0)
 * format = [kml|gpx|geojson] (optional, default gpx)
 * trackname = name used for filename and format specific trackname (optional, default brouter)
 * exportWaypoints = 1 to export them (optional, default is no export)
 * pois = lon,lat,name|... (optional)
 *
 * example: /brouter?lonlats=1.1,1.2|2.1,2.2|3.1,3.2|4.1,4.2&nogos=-1.1,-1.2,1|-2.1,-2.2,2&profile=shortest&alternativeidx=1&format=kml
 */

const settings = {
    //     URL_TEMPLATE:
    //         '/brouter?lonlats={lonlats}&nogos={nogos}&polylines={polylines}&polygons={polygons}&profile={profile}&alternativeidx={alternativeidx}&format={format}',
    PRECISION: 6
    //     NUMBER_SEPARATOR: ',',
    //     GROUP_SEPARATOR: '|'
};

import store from '@/store';

function buildUrl(lonlats, nogos) {
    // TODO: get current (custom) profile
    // TODO: get current alternative route

    const profile = 'fastbike';
    const alternativeidx = 0;
    const format = 'geojson'; // do we understand anything else?

    let urlPrefix = location.hostname == 'localhost' ? 'http://localhost:17777' : '';
    let urlBackendPath = `/brouter`;
    let url = `${urlPrefix}${urlBackendPath}`;

    url += `?profile=${profile}`;
    url += `&alternativeidx=${alternativeidx}`;
    url += `&format=${format}`;

    nogos = (nogos || [])
        .map(nogo => {
            return `${nogo.latlng.lng.toFixed(settings.PRECISION)},${nogo.latlng.lat.toFixed(
                settings.PRECISION
            )},${nogo.radius.toFixed(0)}`;
        })
        .join('|');
    if (nogos) url += `&nogos=${nogos}`;

    lonlats = (lonlats || [])
        .map(lonlat => {
            return `${lonlat.lng.toFixed(settings.PRECISION)},${lonlat.lat.toFixed(settings.PRECISION)}`;
        })
        .join('|');
    if (lonlats) url += `&lonlats=${lonlats}`;

    return url;
}

async function getRouteSegment(from, to) {
    let nogos = store.state.nogos;
    let url = buildUrl([from, to], nogos);

    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function route(markerStart, markerEnd, done) {
    getRouteSegment(markerStart.getLatLng(), markerEnd.getLatLng())
        .then(data => {
            done(null, data);
        })
        .catch(error => {
            done(error);
            console.log('fetch.error', error);
        });
}

const BRouter = {
    route
};

export default BRouter;
export { route, buildUrl }; // make testable
