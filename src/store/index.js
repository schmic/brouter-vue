import Vue from 'vue';
import Vuex from 'vuex';

import Lockr from 'lockr';

import LockrPlugin from './plugin/lockr';

import POI from '@/model/POI';
import NoGo from '@/model/NoGo';
import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/helpers/stats';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [LockrPlugin],
    state: {
        trackname: Lockr.get('state/trackname', undefined),
        alternativeIdx: Lockr.get('state/alternativeIdx', 0),
        profile: Lockr.get(`state/profile`, 'fastbike'),
        waypoints: Lockr.get('state/waypoints', []),
        nogos: Lockr.get('state/nogos', []),
        pois: Lockr.get('state/pois', []),
        stats: {
            distance: 0,
            totaltime: 0,
            formattedtime: '0:00',
            ascend: 0,
            descend: 0
        },
        routes: Lockr.get('routes', [])
    },
    mutations: {
        alternativeIdxUpdate(state, alternativeIdx) {
            state.alternativeIdx = alternativeIdx;
        },
        profileUpdate(state, profile) {
            state.profile = profile;
        },
        routesUpdate(state, routes) {
            state.routes = routes;
        },
        tracknameUpdate(state, trackname) {
            state.trackname = trackname;
        },
        poiUpdate(state, poi) {
            poi = new POI(poi);
            state.pois = state.pois.filter(_poi => !poi.equalsTo(_poi)).concat([poi]);
        },
        poiRemove(state, poi) {
            poi = new POI(poi);
            state.pois = state.pois.filter(_poi => !poi.equalsTo(_poi));
        },
        poisUpdate(state, pois) {
            state.pois = pois.map(poi => new POI(poi));
        },
        nogoUpdate(state, nogo) {
            nogo = new NoGo(nogo);
            state.nogos = state.nogos.filter(_nogo => !nogo.equalsTo(_nogo)).concat([nogo]);
        },
        nogoRemove(state, nogo) {
            nogo = new NoGo(nogo);
            state.nogos = state.nogos.filter(_nogo => !nogo.equalsTo(_nogo));
        },
        nogosUpdate(state, nogos) {
            state.nogos = nogos.map(nogo => new NoGo(nogo));
        },
        waypointsUpdate(state, trackDrawerNodes) {
            // from trackdrawer event
            let markers = [];
            trackDrawerNodes.map(node => (markers = markers.concat(node.markers)));
            state.waypoints = markers.map(
                marker => new Waypoint(marker._leaflet_id, undefined, marker.getLatLng(), marker.options)
            );
        },
        segmentsUpdate(state, trackDrawerSteps) {
            // from trackdrawer event
            let edges = [];
            trackDrawerSteps.map(step => (edges = edges.concat(step.edges)));
            state.segments = edges.map(
                edge =>
                    new Segment(
                        edge._leaflet_id,
                        edge._startMarkerId,
                        edge._endMarkerId,
                        edge.getLatLngs(),
                        edge.options
                    )
            );
            state.segments.length ? statsCalc(state) : statsReset(state);
        }
    },
    actions: {
        waypointsClear({ commit }) {
            commit('waypointsUpdate', []);
        },
        nogosClear({ commit }) {
            commit('nogosUpdate', []);
        },
        poisClear({ commit }) {
            commit('poisUpdate', []);
        },
        tracknameClear({ commit }) {
            commit('tracknameUpdate', undefined);
        },
        routeClear({ dispatch }) {
            dispatch('tracknameClear', []);
            dispatch('waypointsClear', []);
            dispatch('nogosClear', []);
            dispatch('poisClear', []);
        },
        routeSave({ commit }, trackname) {
            commit('tracknameUpdate', trackname);
            const route = this.getters.currentRoute;
            Lockr.sadd('routes', route.trackname);
            Lockr.set(`route_${route.trackname}`, route);
            commit('routesUpdate', Lockr.smembers('routes'));
        },
        routeLoad({ commit }, trackname) {
            const route = Lockr.get(`route_${trackname}`);
            commit('stateRestore', route);
        },
        routeRemove({ commit, dispatch }, trackname) {
            Lockr.srem('routes', trackname);
            Lockr.rm(`route_${trackname}`);
            commit('routesUpdate', Lockr.smembers('routes'));
            if (trackname == this.getters.currentRoute.trackname) {
                dispatch('routeClear');
            }
        }
    },
    getters: {
        currentRoute(state) {
            return {
                trackname: state.trackname,
                waypoints: state.waypoints,
                nogos: state.nogos,
                pois: state.pois,
                stats: state.stats
            };
        },
        routeNames(state) {
            return state.routes;
        },
        routeByName: state => trackname => {
            state.routes; // don't need it but must do something
            return Lockr.get(`route_${trackname}`);
        }
    }
});
