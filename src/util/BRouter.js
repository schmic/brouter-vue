// HINT: URL example for the BRouter backend
// => /brouter?lonlats=1.1,1.2|2.1,2.2|3.1,3.2|4.1,4.2&nogos=-1.1,-1.2,1|-2.1,-2.2,2&profile=shortest&alternativeidx=1&format=kml

const settings = {
    //     URL_TEMPLATE:
    //         '/brouter?lonlats={lonlats}&nogos={nogos}&polylines={polylines}&polygons={polygons}&profile={profile}&alternativeidx={alternativeidx}&format={format}',
    PRECISION: 6
    //     NUMBER_SEPARATOR: ',',
    //     GROUP_SEPARATOR: '|'
};

import store from '@/store';

async function getRouteSegment(from, to) {
    // TODO: get current (custom) profile
    // TODO: get current alternative route
    // TODO: take NoGo areas into account

    const profile = 'fastbike';
    const alternativeidx = 0;
    const format = 'geojson'; // do we understand anything else?

    let urlPrefix = location.hostname == 'localhost' ? 'http://localhost:17777' : '';
    let urlBackendPath = `/brouter`;
    let baseURL =
        `${urlPrefix}${urlBackendPath}?` +
        [`profile=${profile}`, `alternativeidx=${alternativeidx}`, `format=${format}`].join('&');

    let nogos = store.state.nogos
        .map(nogo => {
            return `${nogo.latlng.lng.toFixed(settings.PRECISION)},${nogo.latlng.lat.toFixed(
                settings.PRECISION
            )},${nogo.radius.toFixed(0)}`;
        })
        .join('|');

    let lonlats = `${from.lng.toFixed(settings.PRECISION)},${from.lat.toFixed(settings.PRECISION)}|${to.lng.toFixed(
        settings.PRECISION
    )},${to.lat.toFixed(6)}`;

    let url = `${baseURL}&lonlats=${lonlats}&nogos=${nogos}`;

    let response = await fetch(url);
    let data = await response.json();
    return data;
}

const BRouter = {
    route(markerStart, markerEnd, done) {
        getRouteSegment(markerStart.getLatLng(), markerEnd.getLatLng())
            .then(data => {
                done(null, data);
            })
            .catch(error => {
                done(error);
                console.log('fetch.error', error);
            });
    }
};

export default BRouter;
