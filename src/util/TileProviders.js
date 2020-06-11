const TileProviders = [
    {
        name: 'Cycloosm',
        visible: true,
        url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
        attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    },
    {
        name: 'OpenStreetMap',
        visible: false,
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
        name: 'OpenTopoMap',
        visible: false,
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
];

export { TileProviders };
