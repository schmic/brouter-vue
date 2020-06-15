<template>
    <div class="columns is-mobile">
        <div class="column is-one-quarter">
            <route-meta></route-meta>
            <track-meta></track-meta>
            <waypoint-list></waypoint-list>
        </div>
        <div class="column">
            <l-map
                ref="map"
                :style="{ cursor: toolBarMode != undefined ? 'crosshair' : 'default' }"
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
                <l-control position="topleft">
                    <div class="dropdown" :class="{ 'is-active': dropDown.menu }" style="margin-right: 1em">
                        <div class="dropdown-trigger">
                            <button
                                @click="dropDown.menu = !dropDown.menu"
                                class="button is-small is-primary"
                                aria-haspopup="true"
                                aria-controls="dropdown-menu"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a
                                    class="dropdown-item is-small"
                                    @click="
                                        dropDown.menu = false;
                                        onRouteClear();
                                    "
                                >
                                    Clear Everything
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown" :class="{ 'is-active': dropDown.tileProvider }">
                        <div class="dropdown-trigger">
                            <button
                                @click="dropDown.tileProvider = !dropDown.tileProvider"
                                class="button is-small is-primary"
                                aria-haspopup="true"
                                aria-controls="dropdown-tileprovider"
                            >
                                <span>Map</span>
                                <span class="icon is-small">
                                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-tileprovider" role="menu">
                            <div class="dropdown-content">
                                <a
                                    v-for="tileProvider in tileProviders"
                                    class="dropdown-item is-small"
                                    :class="{ 'is-active': tileProvider.visible }"
                                    :key="tileProvider.id"
                                    @click="
                                        setTileprovider(tileProvider);
                                        tileProviderDropDown = false;
                                    "
                                >
                                    {{ tileProvider.name }}
                                </a>
                            </div>
                        </div>
                    </div>
                </l-control>
                <l-control position="topright"> </l-control>
                <l-control position="bottomleft">
                    <div class="buttons has-addons" v-shortkey="['esc']" @shortkey="toolBarMode = undefined">
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Remove something (d)"
                            :class="{ 'is-primary': toolBarMode === 'delete' }"
                            v-shortkey="['x']"
                            @shortkey="toolBarMode = 'delete'"
                            @click="toolBarMode = 'delete'"
                        >
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Add NoGo area (n)"
                            :class="{ 'is-primary': toolBarMode === 'nogo' }"
                            v-shortkey="['n']"
                            @shortkey="toolBarMode = 'nogo'"
                            @click="toolBarMode = 'nogo'"
                        >
                            <span class="icon">
                                <i class="fa fa-ban"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Split route (s)"
                            :class="{ 'is-primary': toolBarMode === 'insert' }"
                            v-shortkey="['s']"
                            @shortkey="toolBarMode = 'insert'"
                            @click="toolBarMode = 'insert'"
                        >
                            <span class="icon">
                                <i class="fa fa-cut"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Change waypoint to sleepover (o)"
                            :class="{ 'is-primary': toolBarMode === 'promote' }"
                            v-shortkey="['o']"
                            @shortkey="toolBarMode = 'promote'"
                            @click="toolBarMode = 'promote'"
                        >
                            <span class="icon">
                                <i class="fa fa-bed"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Change sleepover to waypoint (Shift+o)"
                            :class="{ 'is-primary': toolBarMode === 'demote' }"
                            v-shortkey="['shift', 'o']"
                            @shortkey="toolBarMode = 'demote'"
                            @click="toolBarMode = 'demote'"
                        >
                            <span class="icon">
                                <i class="fa fa-map-signs"></i>
                            </span>
                        </button>
                        <button
                            class="button is-small is-dark is-rounded"
                            title="Add waypoint (w)"
                            :class="{ 'is-primary': toolBarMode === 'add' }"
                            v-shortkey="['w']"
                            @shortkey="toolBarMode = 'add'"
                            @click="toolBarMode = 'add'"
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

import { LMap, LTileLayer, LControl } from 'vue2-leaflet';
import BRouter from '@/util/BRouter';
import TileProviders from '@/util/TileProviders';
import RouteMeta from '@/components/RouteMeta.vue';
import TrackMeta from '@/components/TrackMeta.vue';
import WaypointList from '@/components/WaypointList.vue';

export default {
    name: 'Map',
    components: {
        RouteMeta,
        TrackMeta,
        WaypointList,
        LMap,
        LTileLayer,
        LControl
    },
    data() {
        return {
            dropDown: {
                tileProvider: false,
                menu: false
            },
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
                editable: true
            },
            zoom: 10,
            center: latLng(49.73868, 8.62084),
            nogos: [],
            pois: []
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
                this.$store.commit('waypointsUpdate', this.trackDrawer.getNodes());
                this.$store.commit('segmentsUpdate', this.trackDrawer.getSteps());
            });

            // import
            this.$store.state.waypoints.forEach(waypoint => {
                let marker = window.L.TrackDrawer.node(waypoint.latlng).setType(waypoint.options.type);
                this.trackDrawerToolBar._bindMarkerEvents(marker);
                this.trackDrawer.addNode(marker);
            });
            this.$store.state.nogos.forEach(nogo => {
                nogo = this._createNoGo(nogo.latlng, { radius: nogo.radius }, this.$refs.map.mapObject);
                this.$store.commit('nogoUpdate', nogo);
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
            if (this.toolBarMode === 'nogo') {
                this.toolBarMode = undefined;
                let nogo = this._createNoGo(evt.latlng, { radius: 2500 }, this.$refs.map.mapObject);
                this.$store.commit('nogoUpdate', nogo);
                this.trackDrawer.refreshEdges();
            }
        },
        setTileprovider(provider) {
            this.tileProviders.forEach(p => {
                if (p.name == provider.name) p.visible = true;
                else p.visible = false;
            });
        },
        onRouteClear() {
            this.$store.dispatch('routeClear');
            location.reload();
        },
        _createNoGo(latlng, options, map) {
            let nogo = window.L.circle(latlng, options);
            return nogo
                .addTo(map)
                .on('dblclick', evt => {
                    window.L.DomEvent.stop(evt);
                })
                .on('click', evt => {
                    window.L.DomEvent.stop(evt);
                    if (this.toolBarMode == 'delete') {
                        evt.target.remove();
                        this.$store.commit('nogoRemove', evt.target);
                    } else {
                        evt.target.toggleEdit();
                        if (evt.target.editEnabled()) {
                            evt.target.setStyle({ color: 'darkred' });
                        } else {
                            evt.target.setStyle({ color: '#3388ff' });
                            this.$store.commit('nogoUpdate', evt.target);
                            this.trackDrawer.refreshEdges();
                        }
                    }
                });
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
