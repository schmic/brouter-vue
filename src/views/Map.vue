<template>
    <div class="columns is-mobile">
        <div v-if="showSidebar" class="column is-one-quarter-desktop is-one-half-tablet is-three-quarters-mobile">
            <route-meta></route-meta>
            <track-meta></track-meta>
            <waypoint-list></waypoint-list>
            <poi-list></poi-list>
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
                    :attribution="tileProvider.options.attribution"
                    layer-type="base"
                />
                <l-control position="topleft">
                    <button
                        class="button is-primary"
                        @click="
                            showSidebar = !showSidebar;
                            $refs.map.mapObject._onResize();
                        "
                    >
                        <span class="icon">
                            <i class="fa" :class="showSidebar ? 'fa-angle-left' : 'fa-angle-right'"></i>
                        </span>
                    </button>
                    <div class="dropdown" :class="{ 'is-active': dropDown.menu }" style="margin-right: 1em">
                        <div class="dropdown-trigger">
                            <button
                                class="button is-primary"
                                aria-haspopup="true"
                                aria-controls="dropdown-menu"
                                @click="dropDown.menu = !dropDown.menu"
                            >
                                <span class="icon">
                                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div id="dropdown-menu" class="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a
                                    class="dropdown-item is-small"
                                    @click="
                                        dropDown.menu = false;
                                        onRouteClear();
                                    "
                                >
                                    Clear route
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown" :class="{ 'is-active': dropDown.tileProvider }">
                        <div class="dropdown-trigger">
                            <button
                                aria-haspopup="true"
                                class="button is-small is-primary"
                                aria-controls="dropdown-tileprovider"
                                @click="dropDown.tileProvider = !dropDown.tileProvider"
                            >
                                <span>Map Providers</span>
                                <span class="icon is-small">
                                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div id="dropdown-tileprovider" class="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a
                                    v-for="tileProvider in tileProviders"
                                    :key="tileProvider.id"
                                    class="dropdown-item is-small"
                                    :class="{ 'is-active': tileProvider.visible }"
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
                    <div v-shortkey="['esc']" class="buttons has-addons" @shortkey="toolBarMode = undefined">
                        <button
                            v-shortkey="['x']"
                            class="button is-dark is-rounded"
                            title="Remove something (d)"
                            :class="{ 'is-primary': toolBarMode === 'delete' }"
                            @shortkey="toolBarMode = 'delete'"
                            @click="toolBarMode = 'delete'"
                        >
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['n']"
                            class="button is-dark is-rounded"
                            title="Add NoGo area (n)"
                            :class="{ 'is-primary': toolBarMode === 'nogo' }"
                            @shortkey="toolBarMode = 'nogo'"
                            @click="toolBarMode = 'nogo'"
                        >
                            <span class="icon">
                                <i class="fa fa-ban"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['p']"
                            class="button is-dark is-rounded"
                            title="Add POI (p)"
                            :class="{ 'is-primary': toolBarMode === 'poi' }"
                            @shortkey="toolBarMode = 'poi'"
                            @click="toolBarMode = 'poi'"
                        >
                            <span class="icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['s']"
                            class="button is-dark is-rounded"
                            title="Split route (s)"
                            :class="{ 'is-primary': toolBarMode === 'insert' }"
                            @shortkey="toolBarMode = 'insert'"
                            @click="toolBarMode = 'insert'"
                        >
                            <span class="icon">
                                <i class="fa fa-cut"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['o']"
                            class="button is-dark is-rounded"
                            title="Change waypoint to sleepover (o)"
                            :class="{ 'is-primary': toolBarMode === 'promote' }"
                            @shortkey="toolBarMode = 'promote'"
                            @click="toolBarMode = 'promote'"
                        >
                            <span class="icon">
                                <i class="fa fa-bed"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['shift', 'o']"
                            class="button is-dark is-rounded"
                            title="Change sleepover to waypoint (Shift+o)"
                            :class="{ 'is-primary': toolBarMode === 'demote' }"
                            @shortkey="toolBarMode = 'demote'"
                            @click="toolBarMode = 'demote'"
                        >
                            <span class="icon">
                                <i class="fa fa-map-signs"></i>
                            </span>
                        </button>
                        <button
                            v-shortkey="['w']"
                            class="button is-dark is-rounded"
                            title="Add waypoint (w)"
                            :class="{ 'is-primary': toolBarMode === 'add' }"
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
import { mapMutations, mapActions } from 'vuex';
import { latLng } from 'leaflet';

import { LMap, LTileLayer, LControl } from 'vue2-leaflet';
import BRouter from '@/util/BRouter';
import TileProviders from '@/util/TileProviders';

import RouteMeta from '@/components/RouteMeta.vue';
import TrackMeta from '@/components/TrackMeta.vue';
import PoiList from '@/components/PoiList.vue';
import WaypointList from '@/components/WaypointList.vue';

export default {
    name: 'Map',
    components: {
        RouteMeta,
        TrackMeta,
        PoiList,
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
            showSidebar: true,
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
    created() {
        if (this.$route.query.share) this.$router.push({ path: 'route', query: this.$route.query });

        let defaultZoom = JSON.stringify(this.zoom);
        this.zoom = parseInt(localStorage.getItem('map/zoom') || defaultZoom);

        let defaultCenter = JSON.stringify(this.center);
        this.center = JSON.parse(localStorage.getItem('map/center') || defaultCenter);
    },
    methods: {
        ...mapMutations(['nogoUpdate', 'poiUpdate', 'waypointsUpdate', 'segmentsUpdate']),
        ...mapActions(['routeClear']),
        onMapReady() {
            this.trackDrawer = window.L.TrackDrawer.track(this.trackDrawerOptions).addTo(this.$refs.map.mapObject);
            this.trackDrawerToolBar = window.L.TrackDrawer.toolBar(this.trackDrawer).addTo(this.$refs.map.mapObject);

            // import
            this.$store.state.waypoints.forEach(waypoint => {
                let marker = window.L.TrackDrawer.node(waypoint.latlng).setType(waypoint.options.type);
                this.trackDrawerToolBar._bindMarkerEvents(marker);
                this.trackDrawer.addNode(marker);
            });
            this.$store.state.nogos.forEach(nogo => {
                nogo = this._createNoGo(nogo.latlng, { radius: nogo.radius }, this.$refs.map.mapObject);
                this.nogoUpdate(nogo);
            });
            this.$store.state.pois.forEach(poi => {
                poi = this._createPOI(poi.latlng, {}, this.$refs.map.mapObject);
                this.poiUpdate(poi);
            });

            this.trackDrawer.on('TrackDrawer:done', () => {
                this.waypointsUpdate(this.trackDrawer.getNodes());
                this.segmentsUpdate(this.trackDrawer.getSteps());
            });

            this.$store.subscribe(mutation => {
                // this does not feel right here
                if (mutation.type == 'alternativeIdxUpdate') this.refreshEdges();
                if (mutation.type == 'profileUpdate') this.refreshEdges();
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
            let map = this.$refs.map.mapObject;

            if (this.toolBarMode === 'nogo') {
                this.toolBarMode = undefined;
                let nogo = this._createNoGo(evt.latlng, { radius: 2500 }, map);
                this.nogoUpdate(nogo);
                this.refreshEdges();
            } else if (this.toolBarMode === 'poi') {
                this.toolBarMode = undefined;
                let poi = this._createPOI(evt.latlng, {}, map);
                this.poiUpdate(poi);
            }
        },
        setTileprovider(provider) {
            this.tileProviders.forEach(p => {
                if (p.name == provider.name) p.visible = true;
                else p.visible = false;
            });
        },
        onRouteClear() {
            this.routeClear();
            location.reload();
        },
        refreshEdges() {
            this.trackDrawer.refreshEdges();
        },
        _createPOI(latlng, options, map) {
            options = {
                ...{
                    draggable: true,
                    icon: window.L.AwesomeMarkers.icon({
                        icon: 'map-marker-alt',
                        prefix: 'fa',
                        markerColor: 'purple'
                    })
                },
                ...options
            };
            let poi = window.L.marker(latlng, options);
            return poi.addTo(map).on('click', evt => {
                let poi = evt.target;
                window.L.DomEvent.stop(evt);
                if (this.toolBarMode == 'delete') {
                    poi.remove();
                    this.poiRemove(poi);
                }
            });
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
                        this.nogoRemove(evt.target);
                    } else {
                        evt.target.toggleEdit();
                        if (evt.target.editEnabled()) {
                            evt.target.setStyle({ color: 'darkred' });
                        } else {
                            evt.target.setStyle({ color: '#3388ff' });
                            this.nogoUpdate(evt.target);
                            this.refreshEdges();
                        }
                    }
                });
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
