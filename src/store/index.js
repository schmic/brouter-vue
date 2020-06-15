import Vue from 'vue';
import Vuex from 'vuex';

import { version } from '../../package.json';

import NoGo from '@/model/NoGo';
import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/stats';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        waypoints: [],
        segments: [],
        nogos: [],
        stats: {
            distance: 0,
            totaltime: 0,
            formattedtime: '0:00',
            ascend: 0,
            descend: 0
        }
    },
    mutations: {
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
            let markers = [];
            trackDrawerNodes.map(node => (markers = markers.concat(node.markers)));
            state.waypoints = markers.map(
                marker => new Waypoint(marker._leaflet_id, undefined, marker.getLatLng(), marker.options)
            );
        },
        segmentsUpdate(state, trackDrawerSteps) {
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
        stateMerge(state, newState) {
            this.replaceState({ ...state, ...newState });
        },
        stateSave(state) {
            localStorage.setItem('state/waypoints', JSON.stringify(state.waypoints));
            localStorage.setItem('state/nogos', JSON.stringify(state.nogos));
        }
    },
    actions: {
        stateRestore({ commit }) {
            let storageVersion = localStorage.getItem('state/version') || version;

            if (version !== storageVersion) {
                // migrate storage
            } else {
                console.log(`Storage version ${version} verified`);
            }

            if (localStorage.getItem('state/waypoints')) {
                commit('stateMerge', {
                    waypoints: JSON.parse(localStorage.getItem('state/waypoints') || '[]'),
                    nogos: JSON.parse(localStorage.getItem('state/nogos') || '[]')
                });
            }
        },
        stateSave({ commit }, triggeredMutation) {
            triggeredMutation.type.startsWith('waypoint') && commit('stateSave');
            triggeredMutation.type.startsWith('nogo') && commit('stateSave');
        },
        waypointsClear({ commit }) {
            commit('waypointsUpdate', []);
        },
        nogosClear({ commit }) {
            commit('nogosUpdate', []);
        },
        routeClear({ dispatch }) {
            dispatch('waypointsClear', []);
            dispatch('nogosClear', []);
        }
    }
});
