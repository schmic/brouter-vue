<template>
    <div class="columns is-mobile">
        <div class="column is-one-quarter">
            <track-meta :track-stats="stats"></track-meta>
            <waypoint-list :waypoints="waypoints"></waypoint-list>
        </div>
        <div class="column">
            <l-map
                ref="map"
                :style="{ cursor: mapOptions.addWaypoint || mapOptions.addNogo ? 'crosshair' : 'default' }"
                :zoom="zoom"
                :center="center"
                :options="mapOptions"
                @ready="mapReady"
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
                <l-control position="topleft">
                    <div class="buttons has-addons">
                        <button class="button is-small is-dark is-rounded" @click="clearWaypoints">
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': mapOptions.addNogo }"
                            @click="mapOptions.addNogo = !mapOptions.addNogo"
                        >
                            <span class="icon">
                                <i class="far fa-circle"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': toolBarMode === 'insert' }"
                            @click="setToolBarMode('insert')"
                        >
                            <span class="icon">
                                <i class="fa fa-cut"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': toolBarMode === 'promote' }"
                            @click="setToolBarMode('promote')"
                        >
                            <span class="icon">
                                <i class="fa fa-bed"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': toolBarMode === 'demote' }"
                            @click="setToolBarMode('demote')"
                        >
                            <span class="icon">
                                <i class="fa fa-map-signs"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': toolBarMode === 'delete' }"
                            @click="setToolBarMode('delete')"
                        >
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            :class="{ 'is-success': toolBarMode === 'add' }"
                            @click="setToolBarMode('add')"
                        >
                            <span class="icon">
                                <i class="fa fa-pen"></i>
                            </span>
                        </button>
                    </div>
                </l-control>
                <l-layer-group layer-type="overlay" name="waypoints">
                    <l-marker
                        v-for="(marker, index) in waypoints"
                        :name="marker.id"
                        :key="marker.id"
                        :draggable="mapOptions.addWaypoint"
                        :lat-lng="marker.latlng"
                        @update:lat-lng="waypointMoved(index, marker.id, $event)"
                        @click="waypointClicked(index, marker.id, $event)"
                    ></l-marker>
                </l-layer-group>
                <l-layer-group layer-type="overlay" name="NoGo">
                    <l-circle
                        v-for="(nogo, index) in nogos"
                        :key="nogo.id"
                        :lat-lng="nogo.latlng"
                        :radius="nogo.radius"
                        @click="nogoClicked(index, nogo.id, $event)"
                    />
                </l-layer-group>
                <l-layer-group layer-type="overlay" name="POI"> </l-layer-group>
            </l-map>
        </div>
    </div>
</template>

<script>
import { Icon, latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LCircle, LLayerGroup, LControlLayers } from 'vue2-leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import TrackMeta from '@/components/TrackMeta.vue';
import WaypointList from '@/components/WaypointList.vue';
import { TileProviders } from '../util/';

export default {
    name: 'Map',
    components: {
        TrackMeta,
        WaypointList,
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LCircle,
        LControlLayers,
        LLayerGroup
    },
    data() {
        return {
            trackDrawer: undefined,
            trackDrawerToolBar: undefined,
            tileProviders: TileProviders,
            mapOptions: {
                zoomControl: false,
                attributionControl: true,
                zoomSnap: 0.5,
                editable: true,
                addWaypoint: false,
                addNogo: false
            },
            zoom: 13,
            center: latLng(49.706256, 8.625321),
            waypoints: [],
            nogos: [],
            pois: [],
            route: [],
            stats: {
                distance: 0,
                totaltime: 0,
                formattedtime: '0:00',
                ascend: 0
            }
        };
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.$refs.map.mapObject.ANY_LEAFLET_MAP_METHOD();
        // });
    },
    computed: {
        toolBarMode: {
            get() {
                return this.trackDrawerToolBar && this.trackDrawerToolBar.options.mode;
            },
            set(mode) {
                return this.trackDrawerToolBar.setMode(mode);
            }
        }
    },
    methods: {
        setToolBarMode(mode) {
            this.toolBarMode = mode == this.toolBarMode ? null : mode;
        },
        mapReady() {
            let self = this;
            this.trackDrawer = window.L.TrackDrawer.track({
                debug: false,
                routingCallback: function(markerStart, markerEnd, done) {
                    self.getRouteSegment(markerStart.getLatLng(), markerEnd.getLatLng()).then(
                        data => {
                            done(
                                null,
                                data.features[0].geometry.coordinates.map(c => [c[1], c[0], c[2]]) // convert, urgh!
                            );
                        },
                        err => done(err)
                    );
                }
            }).addTo(this.$refs.map.mapObject);
            this.trackDrawerToolBar = window.L.TrackDrawer.toolBar(this.trackDrawer).addTo(this.$refs.map.mapObject);
        },
        mapClicked(evt) {
            console.log('mapClicked.evt', evt);
            // if (this.mapOptions.addNogo) this.nogos.push({ id: UUID(), radius: 5000, latlng: evt.latlng });
            // if (this.mapOptions.addWaypoint) this.waypoints.push({ id: UUID(), latlng: evt.latlng });

            if (this.mapOptions.addNogo) {
                this.$refs.map.mapObject.editTools.startCircle(evt.latlng);
            }
            if (this.mapOptions.addWaypoint) {
                let node = new window.L.TrackDrawer.Node(evt.latlng);
                this.trackDrawer.addNode(node);
            }
        },
        nogoClicked(index, nogoId, evt) {
            console.log('nogoClicked.evt', evt);
        },
        waypointClicked(index, waypointId, evt) {
            console.log('waypointClicked.evt', evt);
            if (!this.mapOptions.addWaypoint) return;
            this.waypoints.splice(index, 1);
        },
        waypointMoved(index, id, latlng) {
            this.waypoints[index].latlng = latlng;
        },
        zoomUpdate(zoom) {
            console.log('zoom', zoom);
        },
        centerUpdate(center) {
            console.log('center', center);
        },
        clearWaypoints() {
            this.waypoints = [];
            this.clearRoute();
        },
        clearRoute() {
            this.route = [];
        },
        async getRouteSegment(from, to) {
            let baseURL = '/brouter?profile=fastbike&alternativeidx=0&format=geojson';
            baseURL = location.hostname == 'localhost' ? 'http://localhost:17777' + baseURL : baseURL;
            const url = `${baseURL}&lonlats=${from.lng},${from.lat}|${to.lng},${to.lat}`;
            console.log('url', url);

            let response = await fetch(url);
            let data = await response.json();
            return data;
        },
        async calcRoute() {
            for (let i = 0; i < this.waypoints.length - 1; i++) {
                const from = this.waypoints[i].latlng;
                const to = this.waypoints[i + 1].latlng;
                let data = await this.getRouteSegment(from, to);
                this.route[i] = {
                    from: from,
                    to: to,
                    geojson: data
                };
            }
            this.route = [].concat(this.route);
            console.log('this.route', this.route);

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
    },
    watch: {
        waypoints() {
            // FIXME: use state engine
            this.calcRoute();
        }
    }
};
</script>

<style>
.container,
.columns {
    flex: 1;
}
.columns > .column {
    padding-bottom: 0;
}
</style>
