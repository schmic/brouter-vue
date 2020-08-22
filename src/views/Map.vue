<template>
    <div class="columns">
        <div v-if="showSidebar" id="map-sidebar" class="column">
            <route-meta></route-meta>
            <track-meta></track-meta>
            <poi-list></poi-list>
        </div>
        <div id="map-column" class="column">
            <div id="map-wrapper" class="column">
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
                        <button
                            class="button is-primary"
                            @click="
                                showFooter = !showFooter;
                                $refs.map.mapObject._onResize();
                            "
                        >
                            <span class="icon">
                                <i class="fa" :class="showFooter ? 'fa-chart-area' : 'fa-chart-area'"></i>
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
            <div v-show="showFooter" id="map-footer">
                <height-profile></height-profile>
            </div>
        </div>
        <div id="map-meta" class="column">Sidebar for more information</div>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { TrackDrawer, divIcon, marker } from 'leaflet';

import { LMap, LTileLayer, LControl } from 'vue2-leaflet';
import BRouter from '../util/BRouter';
import TileProviders from '../util/TileProviders';

import RouteMeta from '../components/RouteMeta.vue';
import TrackMeta from '../components/TrackMeta.vue';
import PoiList from '../components/PoiList.vue';
import HeightProfile from '../components/chart/HeightProfile.vue';

import { createPOI } from '../model/POI';
import { createNoGo } from '../model/NoGo';
import { createWaypoint } from '../model/Waypoint';

export default {
    name: 'Map',
    components: {
        HeightProfile,
        RouteMeta,
        TrackMeta,
        PoiList,
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
            showFooter: false,
            tileProviders: TileProviders,
            mapOptions: {
                zoomControl: false,
                attributionControl: true,
                zoomSnap: 0.5,
                editable: true
            }
        };
    },
    computed: {
        toolBarMode: {
            get() {
                return this.$store.state.toolBarMode;
            },
            set(mode) {
                this.$store.commit('toolBarMode', mode == this.toolBarMode ? null : mode);
            }
        },
        track: {
            get() {
                return this.$store.state.track;
            },
            set(newTrack) {
                this.$store.commit('trackUpdate', newTrack);
            }
        },
        zoom: {
            get() {
                return this.$store.state.mapZoom;
            },
            set(value) {
                this.$store.commit('mapZoom', value);
            }
        },
        center: {
            get() {
                return this.$store.state.mapCenter;
            },
            set(value) {
                this.$store.commit('mapCenter', value);
            }
        }
    },
    methods: {
        ...mapMutations(['nogoUpdate', 'poiUpdate', 'waypointUpdate', 'segmentsUpdate']),
        ...mapActions(['routeClear']),
        onMapReady() {
            const map = this.$refs.map.mapObject;

            map._mouseMarker = marker(map.getCenter(), {
                interactive: true,
                draggable: true,
                opacity: 0,
                icon: divIcon({
                    className: 'line-mouse-marker',
                    iconAnchor: [8, 8], // size/2 + border/2
                    iconSize: [16, 16]
                })
            })
                .on('dragstart', () => {})
                .on('drag', () => {})
                .on('dragend', () => {})
                .addTo(map);

            this.track = TrackDrawer.track({ routingCallback: BRouter.route }).addTo(map);
            this.track.on('TrackDrawer:done', () => this.segmentsUpdate(this.track.getSteps()));

            // this does not feel right here
            this.$store.subscribe(mutation => {
                if (mutation.type == 'alternativeIdxUpdate') this.track.refreshEdges();
                if (mutation.type == 'profileUpdate') this.track.refreshEdges();
                if (mutation.type == 'nogoUpdate') this.track.refreshEdges();
                if (mutation.type == 'nogoRemove') this.track.refreshEdges();
                if (mutation.type == 'routeLoad') this.track.refreshEdges();
            });

            // restore state
            this.$store.state.nogos.forEach(nogo => nogo.l.addTo(map));
            this.$store.state.pois.forEach(poi => poi.l.addTo(map));
            this.$store.state.waypoints.forEach(waypoint => waypoint.l.addTo(this.track));
        },
        onMapZoomChanged(zoom) {
            this.zoom = zoom;
        },
        onMapCenterChanged(center) {
            this.center = center;
        },
        onMapClicked(evt) {
            const map = this.$refs.map.mapObject;
            if (this.toolBarMode === 'nogo') {
                let nogo = createNoGo({ latlng: evt.latlng });
                nogo.l.addTo(map);
                this.nogoUpdate(nogo);
                this.track.refreshEdges();
            } else if (this.toolBarMode === 'poi') {
                let poi = createPOI({ latlng: evt.latlng });
                poi.l.addTo(map);
                this.poiUpdate(poi);
            } else if (this.toolBarMode === 'add') {
                let waypoint = createWaypoint({ latlng: evt.latlng });
                waypoint.l.addTo(this.track);
                this.waypointUpdate(waypoint);
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
        }
    }
};
</script>

<style>
.columns {
    flex-grow: 1;
    display: flex;
}

#map-sidebar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: auto;
}

@media screen and (min-width: 768px) {
    #map-sidebar {
        flex: 0 0 450px;
        max-width: 450px;
        width: auto;
    }
}

@media screen and (max-width: 768px) {
    #map-sidebar {
        flex: 0 0 350px;
        max-width: 350px;
        width: auto;
    }
}

#map-column {
    display: flex;
    flex-direction: column;
    padding: 0;
}

#map-wrapper {
    display: flex;
    flex-grow: 4;
    padding-left: 0;
}

/* #map-footer {
} */

#map-meta {
    display: none;
}
</style>
