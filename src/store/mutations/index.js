import Segment from '@/model/Segment';

import { statsCalc, statsReset } from '@/store/helpers/stats';

export const mutations = {
    trackUpdate(state, track) {
        state.track = track;
    },
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
    waypointUpdate(state, waypoint) {
        const idx = state.waypoints.findIndex(el => el.id === waypoint.id);
        if (idx >= 0) {
            state.waypoints[idx] = waypoint;
        } else {
            state.waypoints.push(waypoint);
        }
    },
    waypointPromote(state, waypoint) {
        state.track.promoteNodeToStopover(waypoint.l);
    },
    waypointDemote(state, waypoint) {
        state.track.demoteNodeToWaypoint(waypoint.l);
    },
    waypointRemove(state, waypoint) {
        state.track.removeNode(waypoint.l);
        // waypoint.l.remove();
        state.waypoints = state.waypoints.filter(_waypoint => !waypoint.equalsTo(_waypoint));
    },
    waypointsUpdate(state, waypoints) {
        state.waypoints = waypoints;
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
