// HINT: URL example for the BRouter backend
// => /brouter?lonlats=1.1,1.2|2.1,2.2|3.1,3.2|4.1,4.2&nogos=-1.1,-1.2,1|-2.1,-2.2,2&profile=shortest&alternativeidx=1&format=kml

// const settings = {
//     URL_TEMPLATE:
//         '/brouter?lonlats={lonlats}&nogos={nogos}&polylines={polylines}&polygons={polygons}&profile={profile}&alternativeidx={alternativeidx}&format={format}',
//     PRECISION: 6,
//     NUMBER_SEPARATOR: ',',
//     GROUP_SEPARATOR: '|'
// };

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

    let url = `${baseURL}&lonlats=${from.lng},${from.lat}|${to.lng},${to.lat}`;

    let response = await fetch(url);
    let data = await response.json();
    return data;
}

const BRouter = {
    route(markerStart, markerEnd, done) {
        getRouteSegment(markerStart.getLatLng(), markerEnd.getLatLng())
            .then(data => {
                done(
                    null,
                    // data.features[0].geometry.coordinates.map(c => [c[1], c[0], c[2]]), // convert, urgh!
                    data
                );
            })
            .catch(error => {
                done(error);
                console.log('fetch.error', error);
            });
    }
};

export default BRouter;
