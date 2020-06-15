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

function getRouteUrl(lonlats, nogos) {
    let url = buildUrl(lonlats, nogos);
    return btoa(url.split('?')[1]);
}

function readRouteUrl(routeStr) {
    let url = atob(routeStr);
    let parts = {};
    url.split('&').forEach(part => {
        let key = part.split('=')[0];
        let values = part.split('=')[1];
        switch (key) {
            case 'lonlats':
                // need to convert from lng,lat to lat,lng
                parts['latlngs'] = values.split('|').map(value => {
                    return {
                        lat: parseFloat(value.split(',')[1]),
                        lng: parseFloat(value.split(',')[0])
                    };
                });
                break;
            case 'nogos':
                parts[key] = values.split('|').map(value => {
                    value = value.split(',');
                    return {
                        radius: parseFloat(value[2]),
                        latlng: {
                            lat: parseFloat(value[1]),
                            lng: parseFloat(value[0])
                        }
                    };
                });
                break;
            default:
                parts[key] = values;
        }
    });
    return parts;
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
    route,
    getRouteSegment,
    getRouteUrl
};

export default BRouter;
export { route, buildUrl, getRouteUrl, readRouteUrl };
