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
    PRECISION: 6
    //     NUMBER_SEPARATOR: ',',
    //     GROUP_SEPARATOR: '|'
};

import store from '@/store';

/**
 * Generate a URL to fetch data from the BRouter backend service
 *
 * @param {Array} lonlats
 * @param {Array} nogos
 * @param {Array} pois
 * @param {Object} options
 */
function buildUrl(lonlats, nogos, pois, options) {
    options = options || {};
    options = { ...{ profile: 'fastbike', alternativeidx: 0, format: 'geojson' }, ...options };

    let urlPrefix = location.hostname == 'localhost' ? 'http://localhost:17777' : '';
    let urlBackendPath = `/brouter`;
    let url = `${urlPrefix}${urlBackendPath}`;

    url += `?profile=${options.profile}`;
    url += `&alternativeidx=${options.alternativeidx}`;
    url += `&format=${options.format}`;
    if (options.trackname) url += `&trackname=${options.trackname}`;

    pois = (pois || [])
        .map((poi, index) => {
            return `${poi.latlng.lng.toFixed(settings.PRECISION)},${poi.latlng.lat.toFixed(
                settings.PRECISION
            )},${poi.name || index}`;
        })
        .join('|');
    if (pois) url += `&pois=${pois}`;

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

function getRouteDownload(trackname, options) {
    trackname = trackname || `brouter-vue`;

    let nogos = store.state.nogos;
    let pois = options.includePOIs ? store.state.pois : [];
    let waypoints = store.state.waypoints.map(waypoint => waypoint.latlng);

    options = {
        ...{
            alternativeidx: store.state.alternativeIdx,
            profile: store.state.profile
        },
        ...options
    };

    return buildUrl(waypoints, nogos, pois, { trackname: trackname, ...options });
}

function getRouteSegment(from, to) {
    let nogos = store.state.nogos;
    let pois = [];
    let options = {
        alternativeidx: store.state.alternativeIdx,
        profile: store.state.profile
    };
    return buildUrl([from, to], nogos, pois, options);
}

async function route(markerStart, markerEnd, done) {
    const url = getRouteSegment(markerStart.getLatLng(), markerEnd.getLatLng());
    try {
        let response = await fetch(url);
        let data = await response.json();
        done(null, data);
    } catch (e) {
        console.log('fetch.error', e);
        done(e);
    }
}

const BRouter = {
    route
};

export default BRouter;
export { buildUrl, getRouteSegment, getRouteDownload }; // make testable
