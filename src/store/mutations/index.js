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
    waypointUpdate(state, waypoint) {
        const idx = state.waypoints.findIndex(el => el.id === waypoint.id);
        if (idx >= 0) {
            state.waypoints[idx] = waypoint;
        } else {
            state.waypoints.push(waypoint);
        }
    },
    waypointRemove(state, waypoint) {
        waypoint.l.remove();
        state.waypoints = state.waypoints.filter(_waypoint => !waypoint.equalsTo(_waypoint));
    },

    waypointsUpdate(state, waypoints) {
        state.waypoints = waypoints;
    },
    routesUpdate(state, routes) {
        state.routes = routes;
    },
    routeLoad(state, route) {
        ['trackname', 'alternativeIdx', 'profile', 'waypoints', 'nogos', 'pois', 'stats'].forEach(
            it => (state[it] = route[it])
        );
    }
};
