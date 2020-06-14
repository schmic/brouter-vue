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
                @ready="onMapReady"
                @update:center="onMapCenterChanged"
                @update:zoom="onMapZoomChanged"
                @click="onMapClicked"
            >
                <l-tile-layer
                    v-for="tileProvider in tileProviders"
                    :key="tileProvider.name"
                    :name="tileProvider.name"
                    :visible="tileProvider.visible"
                    :url="tileProvider.url"
                    :attribution="tileProvider.attribution"
                    layer-type="base"
                />
                <l-control position="bottomleft">
                    <div class="buttons has-addons">
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Create NoGo"
                            :class="{ 'is-primary': mapOptions.addNogo }"
                            @click="mapOptions.addNogo = !mapOptions.addNogo"
                        >
                            <span class="icon">
                                <i class="far fa-circle"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Split route"
                            :class="{ 'is-primary': toolBarMode === 'insert' }"
                            @click="toolBarMode = 'insert'"
                        >
                            <span class="icon">
                                <i class="fa fa-cut"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Change waypoint to sleepover"
                            :class="{ 'is-primary': toolBarMode === 'promote' }"
                            @click="toolBarMode = 'promote'"
                        >
                            <span class="icon">
                                <i class="fa fa-bed"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Change sleepover to waypoint"
                            :class="{ 'is-primary': toolBarMode === 'demote' }"
                            @click="toolBarMode = 'demote'"
                        >
                            <span class="icon">
                                <i class="fa fa-map-signs"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Remove waypoint"
                            :class="{ 'is-primary': toolBarMode === 'delete' }"
                            @click="toolBarMode = 'delete'"
                        >
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Add waypoint"
                            :class="{ 'is-primary': toolBarMode === 'add' }"
                            @click="toolBarMode = 'add'"
                        >
                            <span class="icon">
                                <i class="fa fa-pen"></i>
                            </span>
                        </button>
                    </div>
                </l-control>
                <l-control position="topleft">
                    <div class="dropdown" :class="{ 'is-active': dropdownActive }">
                        <div class="dropdown-trigger">
                            <button
                                @click="dropdownActive = !dropdownActive"
                                class="button is-small is-primary"
                                aria-haspopup="true"
                                aria-controls="dropdown-menu2"
                            >
                                <span>Map</span>
                                <span class="icon is-small">
                                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                            <div class="dropdown-content">
                                <a
                                    v-for="tileProvider in tileProviders"
                                    class="dropdown-item is-small"
                                    :class="{ 'is-active': tileProvider.visible }"
                                    :key="tileProvider.id"
                                    @click="
                                        setTileprovider(tileProvider);
                                        dropdownActive = false;
                                    "
                                >
                                    {{ tileProvider.name }}
                                </a>
                            </div>
                        </div>
                    </div>
                </l-control>
            </l-map>
        </div>
    </div>
</template>

<script>
import { latLng } from 'leaflet';

import { LMap, LTileLayer, LControl } from 'vue2-leaflet';
import BRouter from '@/util/BRouter';
import TileProviders from '@/util/TileProviders';
import TrackMeta from '@/components/TrackMeta.vue';
import WaypointList from '@/components/WaypointList.vue';
import Waypoint from '@/model/Waypoint';
import Segment from '@/model/Segment';

export default {
    name: 'Map',
    components: {
        TrackMeta,
        WaypointList,
        LMap,
        LTileLayer,
        LControl
    },
    data() {
        return {
            dropdownActive: false,
            trackDrawer: undefined,
            trackDrawerToolBar: undefined,
            trackDrawerOptions: {
                debug: false,
                routingCallback: BRouter.route
            },
            tileProviders: TileProviders,
            mapOptions: {
                zoomControl: false,
                attributionControl: true,
                zoomSnap: 0.5,
                editable: true,
                addNogo: false
            },
            zoom: 10,
            center: latLng(49.73868, 8.62084),
            waypoints: [],
            segments: [],
            nogos: [],
            pois: [],
            stats: {
                distance: 0,
                totaltime: 0,
                formattedtime: '0:00',
                ascend: 0,
                descend: 0
            }
        };
    },
    created() {
        let defaultZoom = JSON.stringify(this.zoom);
        this.zoom = parseInt(localStorage.getItem('map/zoom') || defaultZoom);

        let defaultCenter = JSON.stringify(this.center);
        this.center = JSON.parse(localStorage.getItem('map/center') || defaultCenter);
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
                this.trackDrawerToolBar.setMode(mode == this.toolBarMode ? null : mode);
            }
        }
    },
    methods: {
        onMapReady() {
            this.trackDrawer = window.L.TrackDrawer.track(this.trackDrawerOptions).addTo(this.$refs.map.mapObject);
            this.trackDrawerToolBar = window.L.TrackDrawer.toolBar(this.trackDrawer).addTo(this.$refs.map.mapObject);
            this.trackDrawer.on('TrackDrawer:done', () => {
                let markers = [];
                this.trackDrawer.getNodes().map(node => (markers = markers.concat(node.markers)));
                this.waypoints = markers.map(
                    marker => new Waypoint(marker._leaflet_id, undefined, marker._latlng, marker.options)
                );

                let edges = [];
                this.trackDrawer.getSteps().map(step => (edges = edges.concat(step.edges)));
                this.segments = edges.map(
                    edge =>
                        new Segment(
                            edge._leaflet_id,
                            edge._startMarkerId,
                            edge._endMarkerId,
                            edge.getLatLngs(),
                            edge.options
                        )
                );
                this.statsCalc();
            });
        },
        onMapZoomChanged(zoom) {
            this.zoom = zoom;
            localStorage.setItem('map/zoom', zoom);
        },
        onMapCenterChanged(center) {
            this.center = center;
            localStorage.setItem('map/center', JSON.stringify(center));
        },
        onMapClicked(evt) {
            if (this.mapOptions.addNogo) {
                this.mapOptions.addNogo = false;
                var nogo = window.L.circle(evt.latlng, { radius: 500 }).addTo(this.$refs.map.mapObject);
                nogo.enableEdit();
                nogo.on('dblclick', window.L.DomEvent.stop).on('dblclick', nogo.toggleEdit);
            }
        },
        setTileprovider(provider) {
            this.tileProviders.forEach(p => {
                if (p.name == provider.name) p.visible = true;
                else p.visible = false;
            });
        },
        statsReset() {
            this.stats = {
                distance: 0,
                totaltime: 0,
                formattedtime: '0:00',
                ascend: 0,
                descend: 0
            };
        },
        statsCalc() {
            if (this.segments.length <= 0) {
                this.statsReset();
                return;
            }

            this.stats.distance = this.segments.map(segment => segment.distance).reduce((a, b) => a + b, 0);
            this.stats.totaltime = this.segments.map(segment => segment.duration).reduce((a, b) => a + b, 0);
            this.stats.formattedtime =
                Math.trunc(this.stats.totaltime / 3600) +
                ':' +
                ('0' + Math.trunc((this.stats.totaltime % 3600) / 60)).slice(-2);
            this.stats.ascend = this.segments.map(segment => segment.ascend).reduce((a, b) => a + b, 0);
            this.stats.descend = this.segments.map(segment => segment.descend).reduce((a, b) => a + b, 0);
        }
    },
    watch: {}
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
