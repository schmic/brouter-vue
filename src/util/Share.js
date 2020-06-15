function readSharedRoute(routeStr) {
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

export { readSharedRoute };
