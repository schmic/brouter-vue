import Vue from 'vue';
import Vuex from 'vuex';

import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/stats';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        waypoints: [],
        segments: [],
        stats: {
            distance: 0,
            totaltime: 0,
            formattedtime: '0:00',
            ascend: 0,
            descend: 0
        }
    },
    mutations: {
        waypointsUpdate(state, trackDrawerNodes) {
            let markers = [];
            trackDrawerNodes.map(node => (markers = markers.concat(node.markers)));
            state.waypoints = markers.map(
                marker => new Waypoint(marker._leaflet_id, undefined, marker._latlng, marker.options)
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
        }
    },
    actions: {}
});
