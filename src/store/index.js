import Vue from 'vue';
import Vuex from 'vuex';

import Lockr from 'lockr';

import POI from '@/model/POI';
import NoGo from '@/model/NoGo';
import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/stats';

Vue.use(Vuex);
Lockr.prefix = 'brtr_';

export default new Vuex.Store({
    state: {
        trackname: undefined,
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
    },
    mutations: {
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
        },
        stateRestore(state, newState) {
            this.replaceState({ ...state, ...newState });
        },
        stateSave(state) {
            ['trackname', 'waypoints', 'nogos', 'pois'].forEach(it =>
                localStorage.setItem(`state/${it}`, JSON.stringify(state[it]))
            );
        }
    },
    actions: {
        stateRestore({ commit }) {
            const trackname = localStorage.getItem('state/trackname');
            commit('stateRestore', {
                trackname: trackname && trackname != 'undefined' ? JSON.parse(trackname) : undefined,
                waypoints: JSON.parse(localStorage.getItem('state/waypoints') || '[]'),
                nogos: JSON.parse(localStorage.getItem('state/nogos') || '[]'),
                pois: JSON.parse(localStorage.getItem('state/pois') || '[]')
            });
        },
        stateSave({ commit }, triggeredMutation) {
            triggeredMutation.type.startsWith('trackname') && commit('stateSave');
            triggeredMutation.type.startsWith('waypoint') && commit('stateSave');
            triggeredMutation.type.startsWith('nogo') && commit('stateSave');
            triggeredMutation.type.startsWith('poi') && commit('stateSave');
        },
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
        },
        routeLoad({ commit }, trackname) {
            const route = Lockr.get(`route_${trackname}`);
            commit('stateRestore', route);
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
        routeList() {
            return Lockr.smembers('routes').map(trackname => Lockr.get(`route_${trackname}`));
        },
        routeByName(trackname) {
            return Lockr.get(`route_${trackname}`);
        }
    }
});
