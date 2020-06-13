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
            </l-map>
        </div>
    </div>
</template>

<script>
import { latLng } from 'leaflet';

import { LMap, LTileLayer, LControl, LControlLayers } from 'vue2-leaflet';
import TrackMeta from '@/components/TrackMeta.vue';
import WaypointList from '@/components/WaypointList.vue';
import { BRouter, TileProviders } from '../util/';
import Waypoint from '@/model/Waypoint';
import Segment from '@/model/Segment';

export default {
    name: 'Map',
    components: {
        TrackMeta,
        WaypointList,
        LMap,
        LTileLayer,
        LControl,
        LControlLayers
    },
    data() {
        return {
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
            zoom: 13,
            center: latLng(49.706256, 8.625321),
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
        onMapReady() {
            this.trackDrawer = window.L.TrackDrawer.track(this.trackDrawerOptions).addTo(this.$refs.map.mapObject);
            this.trackDrawerToolBar = window.L.TrackDrawer.toolBar(this.trackDrawer).addTo(this.$refs.map.mapObject);
            this.trackDrawer.on('TrackDrawer:done', () => {
                let nodes = this.trackDrawer.getNodes()[0];
                if (nodes) {
                    this.waypoints = nodes.markers.map(
                        marker => new Waypoint(marker._leaflet_id, undefined, marker._latlng, marker.options)
                    );
                } else {
                    this.resetWaypoints();
                }

                let steps = this.trackDrawer.getSteps()[0];
                if (steps) {
                    this.segments = steps.edges.map(
                        edge =>
                            new Segment(
                                edge._leaflet_id,
                                edge._startMarkerId,
                                edge._endMarkerId,
                                edge.getLatLngs(),
                                edge.options
                            )
                    );
                    this.calcStats();
                } else {
                    this.resetSegments();
                }
            });
        },
        setToolBarMode(mode) {
            this.toolBarMode = mode == this.toolBarMode ? null : mode;
        },
        mapClicked(evt) {
            if (this.mapOptions.addNogo) {
                this.mapOptions.addNogo = false;
                var nogo = window.L.circle(evt.latlng, { radius: 500 }).addTo(this.$refs.map.mapObject);
                nogo.enableEdit();
                nogo.on('dblclick', window.L.DomEvent.stop).on('dblclick', nogo.toggleEdit);
            }
        },
        zoomUpdate(zoom) {
            console.debug('zoom', zoom);
        },
        centerUpdate(center) {
            console.debug('center', center);
        },
        resetWaypoints() {
            this.waypoints = [];
        },
        resetSegments() {
            this.resetStats();
            this.segments = [];
        },
        resetStats() {
            this.stats = {
                distance: 0,
                totaltime: 0,
                formattedtime: '0:00',
                ascend: 0,
                descend: 0
            };
        },
        calcStats() {
            if (this.segments.length <= 0) {
                this.resetStats();
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
