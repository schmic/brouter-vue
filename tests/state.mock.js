const state = {
    trackname: 'West East',
    alternativeIdx: 0,
    profile: 'fastbike',
    waypoints: [
        {
            id: 419,
            latlng: { lat: 49.638158, lng: 8.418889, alt: 90 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        },
        {
            id: 422,
            latlng: { lat: 49.650839, lng: 8.530293, alt: 95.75 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        },
        {
            id: 428,
            latlng: { lat: 49.67951, lng: 8.619322, alt: 104.75 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        },
        {
            id: 433,
            latlng: { lat: 49.718229, lng: 8.730714, alt: 357 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        },
        {
            id: 438,
            latlng: { lat: 49.695033, lng: 8.771771, alt: 449.5 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        },
        {
            id: 443,
            latlng: { lat: 49.702981, lng: 8.839804, alt: 314 },
            options: {
                type: 'waypoint',
                icon: { options: { icon: 'map-signs', markerColor: 'blue', prefix: 'fa' }, _initHooksCalled: true },
                colorName: 'blue'
            }
        }
    ],
    nogos: [
        { id: 448, name: 'TODO: NoGo name', latlng: { lat: 49.654321, lng: 8.654321 }, radius: 2500 },
        { id: 449, name: 'TODO: NoGo name', latlng: { lat: 49.123456, lng: 8.123456 }, radius: 1200 }
    ],
    pois: [
        { id: 450, name: 'TODO:  Name 1', latlng: { lat: 49.67243245469188, lng: 8.698514726319036 } },
        { id: 453, name: 'TODO:  Name 2', latlng: { lat: 49.696871366603204, lng: 8.522688759643914 } },
        { id: 456, name: 'TODO:  Name 3', latlng: { lat: 49.61951348553559, lng: 8.48491364961603 } }
    ],
    stats: { distance: 44446, totaltime: 11060, formattedtime: '3:04', ascend: 782, descend: 556 }
};

export default state;
