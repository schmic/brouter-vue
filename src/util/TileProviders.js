const TileProviders = [
    {
        name: 'OpenStreetMap',
        visible: false,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    {
        name: 'OpenStreetMap - DE',
        visible: true,
        url: 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    {
        name: 'OpenStreetMap - France',
        visible: false,
        url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        options: {
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | {attribution.OpenStreetMap}'
        }
    },
    {
        name: 'Cycloosm',
        visible: false,
        url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
        options: {
            attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    },
    {
        name: 'OpenTopoMap',
        visible: false,
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: {
            attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    },
    {
        name: 'MtbMap',
        visible: false,
        url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
        options: {
            attribution: '{attribution.OpenStreetMap} &amp; USGS'
        }
    },
    {
        name: 'HikeBike',
        visible: false,
        // url: 'https://tiles.wmflabs.org/{variant}/{z}/{x}/{y}.png',
        url: 'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
        options: {
            maxZoom: 19,
            attribution: '{attribution.OpenStreetMap}',
            variant: 'hikebike'
        },
        variants: {
            HikeBike: {},
            HillShading: {
                options: {
                    maxZoom: 15,
                    variant: 'hillshading'
                }
            }
        }
    },
    {
        name: 'OpenRailwayMap',
        visible: false,
        url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
        options: {
            maxZoom: 19,
            attribution:
                'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    }
    // {
    //     name: 'Thunderforest',
    //     visible: false,
    //     url: 'https://{s}.tile.thunderforest.com/{variant}/{z}/{x}/{y}.png?apikey={apikey}',
    //     options: {
    //         attribution:
    //             '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, {attribution.OpenStreetMap}',
    //         variant: 'cycle',
    //         apikey: '<insert your api key here>',
    //         maxZoom: 22
    //     }
    // },
    // {
    //     /*
    //      * HERE maps API Version 3.
    //      * These basemaps are free, but you need an API key. Please sign up at
    //      * https://developer.here.com/plans
    //      * Version 3 deprecates the app_id and app_code access in favor of apiKey
    //      *
    //      * Supported access methods as of 2019/12/21:
    //      * @see https://developer.here.com/faqs#access-control-1--how-do-you-control-access-to-here-location-services
    //      */
    //     name: 'HEREv3',
    //     visible: false,
    //     url:
    //         'https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/' +
    //         '{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?' +
    //         'apiKey={apiKey}&lg={language}',
    //     options: {
    //         attribution:
    //             'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
    //         subdomains: '1234',
    //         mapID: 'newest',
    //         apiKey: '<insert your apiKey here>',
    //         base: 'base',
    //         variant: 'normal.day',
    //         maxZoom: 20,
    //         type: 'maptile',
    //         language: 'eng',
    //         format: 'png8',
    //         size: '256'
    //     },
    //     variants: {
    //         normalDay: 'normal.day',
    //         normalDayCustom: 'normal.day.custom',
    //         normalDayGrey: 'normal.day.grey',
    //         normalDayMobile: 'normal.day.mobile',
    //         normalDayGreyMobile: 'normal.day.grey.mobile',
    //         normalDayTransit: 'normal.day.transit',
    //         normalDayTransitMobile: 'normal.day.transit.mobile',
    //         normalNight: 'normal.night',
    //         normalNightMobile: 'normal.night.mobile',
    //         normalNightGrey: 'normal.night.grey',
    //         normalNightGreyMobile: 'normal.night.grey.mobile',
    //         normalNightTransit: 'normal.night.transit',
    //         normalNightTransitMobile: 'normal.night.transit.mobile',
    //         reducedDay: 'reduced.day',
    //         reducedNight: 'reduced.night',
    //         basicMap: {
    //             options: {
    //                 type: 'basetile'
    //             }
    //         },
    //         mapLabels: {
    //             options: {
    //                 type: 'labeltile',
    //                 format: 'png'
    //             }
    //         },
    //         trafficFlow: {
    //             options: {
    //                 base: 'traffic',
    //                 type: 'flowtile'
    //             }
    //         },
    //         carnavDayGrey: 'carnav.day.grey',
    //         hybridDay: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'hybrid.day'
    //             }
    //         },
    //         hybridDayMobile: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'hybrid.day.mobile'
    //             }
    //         },
    //         hybridDayTransit: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'hybrid.day.transit'
    //             }
    //         },
    //         hybridDayGrey: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'hybrid.grey.day'
    //             }
    //         },
    //         pedestrianDay: 'pedestrian.day',
    //         pedestrianNight: 'pedestrian.night',
    //         satelliteDay: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'satellite.day'
    //             }
    //         },
    //         terrainDay: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'terrain.day'
    //             }
    //         },
    //         terrainDayMobile: {
    //             options: {
    //                 base: 'aerial',
    //                 variant: 'terrain.day.mobile'
    //             }
    //         }
    //     }
    // }
];

export default TileProviders;
