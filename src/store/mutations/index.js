import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/helpers/stats';

export const mutations = {
    toolBarMode(state, mode) {
        state.toolBarMode = mode;
    },
    tracknameUpdate(state, trackname) {
        state.trackname = trackname;
    },
    alternativeIdxUpdate(state, alternativeIdx) {
        state.alternativeIdx = alternativeIdx;
    },
    profileUpdate(state, profile) {
        state.profile = profile;
    },
    poiUpdate(state, poi) {
        state.pois = state.pois.filter(_poi => !poi.equalsTo(_poi)).concat([poi]);
    },
    poiRemove(state, poi) {
        poi.l.remove();
        state.pois = state.pois.filter(_poi => !poi.equalsTo(_poi));
    },
    poisUpdate(state, pois) {
        state.pois = pois;
    },
    nogoUpdate(state, nogo) {
        state.nogos = state.nogos.filter(_nogo => !nogo.equalsTo(_nogo)).concat([nogo]);
    },
    nogoRemove(state, nogo) {
        nogo.l.remove();
        state.nogos = state.nogos.filter(_nogo => !nogo.equalsTo(_nogo));
    },
    nogosUpdate(state, nogos) {
        state.nogos = nogos;
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
                new Segment(edge._leaflet_id, edge._startMarkerId, edge._endMarkerId, edge.getLatLngs(), edge.options)
        );
        state.segments.length ? statsCalc(state) : statsReset(state);
    },
    routesUpdate(state, routes) {
        state.routes = routes;
    },
    routeLoad(state, route) {
        console.log('route', route);

        ['trackname', 'alternativeIdx', 'profile', 'waypoints', 'nogos', 'pois', 'stats'].forEach(
            it => (state[it] = route[it])
        );
    }
};
