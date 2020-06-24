import POI from '@/model/POI';
import NoGo from '@/model/NoGo';
import Segment from '@/model/Segment';
import Waypoint from '@/model/Waypoint';

import { statsCalc, statsReset } from '@/store/helpers/stats';

export const mutations = {
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
                new Segment(edge._leaflet_id, edge._startMarkerId, edge._endMarkerId, edge.getLatLngs(), edge.options)
        );
        state.segments.length ? statsCalc(state) : statsReset(state);
    }
};
