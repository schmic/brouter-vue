<template>
    <div class="columns is-mobile">
        <div class="column is-one-quarter">
            <article class="message is-primary">
                <div class="message-header">
                    <p>Map</p>
                </div>
                <div class="message-body">
                    <p>Center {{ currentCenter.lat.toFixed(4) }} / {{ currentCenter.lng.toFixed(4) }}</p>
                    <p>Zoom is: {{ currentZoom }}</p>
                </div>
            </article>

            <!-- <button @click="showMap = !showMap">
                Toggle map
            </button> -->
            <article class="message is-success">
                <div class="message-header">
                    <p>Statistic</p>
                </div>
                <div class="message-body">
                    <p>Distance: {{ (distance / 1000).toFixed(2) }} km</p>
                    <p>Duration: {{ formattedtime }} h</p>
                    <p>Ascend: {{ ascend }} m</p>
                </div>
            </article>
        </div>
        <div class="column">
            <l-map
                v-if="showMap"
                :zoom="zoom"
                :center="center"
                :options="mapOptions"
                @update:center="centerUpdate"
                @update:zoom="zoomUpdate"
                @click="mapClicked"
            >
                <l-control-layers :position="position" :collapsed="false" :sort-layers="true" />
                <l-tile-layer
                    v-for="tileProvider in tileProviders"
                    :key="tileProvider.name"
                    :name="tileProvider.name"
                    :visible="tileProvider.visible"
                    :url="tileProvider.url"
                    :attribution="tileProvider.attribution"
                    layer-type="base"
                />
                <l-layer-group layer-type="overlay" name="Markers">
                    <l-marker
                        v-for="(marker, index) in markers"
                        :name="marker.id"
                        :key="marker.id"
                        :draggable="true"
                        :lat-lng="marker.latlng"
                        @update:lat-lng="markerMoved(index, marker.id, $event)"
                        @click="markerClicked(index, marker.id, $event)"
                    ></l-marker>
                </l-layer-group>
                <l-geo-json :geojson="geojson"></l-geo-json>
                <l-control position="bottomright">
                    <button @click="clickHandler">
                        I am a useless button!
                    </button>
                    <button @click="clickHandler">
                        I am a useless button!
                    </button>
                    <button @click="clickHandler">
                        I am a useless button!
                    </button>
                </l-control>
            </l-map>
        </div>
    </div>
</template>

<script>
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LLayerGroup, LControlLayers, LGeoJson } from 'vue2-leaflet';

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export default {
    name: 'Example',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LControlLayers,
        LLayerGroup,
        LGeoJson
    },
    data() {
        return {
            tileProviders: [
                {
                    name: 'OpenStreetMap',
                    visible: true,
                    attribution:
                        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                },
                {
                    name: 'OpenTopoMap',
                    visible: false,
                    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    attribution:
                        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                }
            ],
            zoom: 13,
            center: latLng(49.706256, 8.625321),
            currentZoom: 11.5,
            currentCenter: latLng(49.701169, 8.621349),
            showParagraph: false,
            mapOptions: {
                zoomControl: false,
                attributionControl: true,
                zoomSnap: 0.5
            },
            position: 'topright',
            showMap: true,
            geojson: [],
            markersVisible: false,
            markers: [],
            distance: 0,
            totaltime: 0,
            formattedtime: '0:00',
            ascend: 0
        };
    },
    methods: {
        mapClicked(evt) {
            this.markers.push({ id: uuid(), latlng: evt.latlng });
            this.calcRoute();
        },
        markerClicked(index) {
            this.markers.splice(index, 1);
            this.calcRoute();
        },
        markerMoved(index, id, latlng) {
            this.markers[index].latlng = latlng;
            this.calcRoute();
        },
        zoomUpdate(zoom) {
            this.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.currentCenter = center;
        },
        clickHandler(evt) {
            console.log('evt', evt);
        },
        async calcRoute() {
            this.geojson = [];
            const baseURL = 'http://localhost:17777/brouter?profile=fastbike&alternativeidx=0&format=geojson';

            for (let i = 0; i < this.markers.length - 1; i++) {
                const url = `${baseURL}&lonlats=${this.markers[i].latlng.lng},${this.markers[i].latlng.lat}|${
                    this.markers[i + 1].latlng.lng
                },${this.markers[i + 1].latlng.lat}`;
                let response = await fetch(url);
                let data = await response.json();
                this.geojson.push(data);
            }
            this.distance = this.geojson
                .map(segment => {
                    return parseInt(segment.features[0].properties['track-length']);
                })
                .reduce((a, b) => a + b, 0);

            this.totaltime = this.geojson
                .map(segment => {
                    return parseInt(segment.features[0].properties['total-time']);
                })
                .reduce((a, b) => a + b, 0);

            this.formattedtime =
                Math.trunc(this.totaltime / 3600) + ':' + ('0' + Math.trunc((this.totaltime % 3600) / 60)).slice(-2);

            this.ascend = this.geojson
                .map(segment => {
                    return parseInt(segment.features[0].properties['filtered ascend']);
                })
                .reduce((a, b) => a + b, 0);
        }
    }
};
</script>

<style scoped>
.container,
.columns {
    flex: 1;
}
.columns > .column {
    padding-bottom: 0;
}
</style>
