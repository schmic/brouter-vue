<template>
    <div class="columns is-mobile">
        <div class="column is-one-quarter">
            <track-meta :track-stats="stats"></track-meta>
        </div>
        <div class="column">
            <l-map
                :style="{ cursor: mapOptions.editable ? 'crosshair' : 'default' }"
                :zoom="zoom"
                :center="center"
                :options="mapOptions"
                @update:center="centerUpdate"
                @update:zoom="zoomUpdate"
                @click="mapClicked"
            >
                <l-control-layers position="topright" :collapsed="false" :sort-layers="true" />
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
                        :draggable="mapOptions.editable"
                        :lat-lng="marker.latlng"
                        @update:lat-lng="markerMoved(index, marker.id, $event)"
                        @click="markerClicked(index, marker.id, $event)"
                    ></l-marker>
                </l-layer-group>
                <l-geo-json :geojson="geojson"></l-geo-json>
                <l-control position="topleft">
                    <a
                        class="button is-rounded"
                        :class="{ 'is-success': mapOptions.editable }"
                        @click="toggleMapEditable"
                    >
                        <i class="fa fa-pen"></i>
                    </a>
                </l-control>
            </l-map>
        </div>
    </div>
</template>

<script>
import { Icon, latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LLayerGroup, LControlLayers, LGeoJson } from 'vue2-leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import TrackMeta from '@/views/stats/TrackMeta.vue';
import { TileProviders, UUID } from '../util/';

export default {
    name: 'Map',
    components: {
        TrackMeta,
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
            tileProviders: TileProviders,
            mapOptions: {
                zoomControl: false,
                attributionControl: true,
                zoomSnap: 0.5,
                editable: false
            },
            zoom: 13,
            center: latLng(49.706256, 8.625321),
            geojson: [],
            markers: [],
            stats: {
                distance: 0,
                totaltime: 0,
                formattedtime: '0:00',
                ascend: 0
            }
        };
    },
    methods: {
        mapClicked(evt) {
            if (!this.mapOptions.editable) return;
            this.markers.push({ id: UUID(), latlng: evt.latlng });
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
            console.log('zoom', zoom);
        },
        centerUpdate(center) {
            console.log('center', center);
        },
        toggleMapEditable() {
            this.mapOptions.editable = !this.mapOptions.editable;
        },
        async calcRoute() {
            console.log('location', location);

            this.geojson = [];
            let baseURL = '/brouter?profile=fastbike&alternativeidx=0&format=geojson';
            baseURL = location.hostname == 'localhost' ? 'http://localhost:17777' + baseURL : baseURL;

            for (let i = 0; i < this.markers.length - 1; i++) {
                const url = `${baseURL}&lonlats=${this.markers[i].latlng.lng},${this.markers[i].latlng.lat}|${
                    this.markers[i + 1].latlng.lng
                },${this.markers[i + 1].latlng.lat}`;
                let response = await fetch(url);
                let data = await response.json();
                this.geojson.push(data);
            }

            this.stats.distance = this.geojson
                .map(segment => {
                    return parseInt(segment.features[0].properties['track-length']);
                })
                .reduce((a, b) => a + b, 0);

            this.stats.totaltime = this.geojson
                .map(segment => {
                    return parseInt(segment.features[0].properties['total-time']);
                })
                .reduce((a, b) => a + b, 0);

            this.stats.formattedtime =
                Math.trunc(this.stats.totaltime / 3600) +
                ':' +
                ('0' + Math.trunc((this.stats.totaltime % 3600) / 60)).slice(-2);

            this.stats.ascend = this.geojson
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
