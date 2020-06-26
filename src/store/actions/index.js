import Lockr from 'lockr';

export const actions = {
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
    routeSave({ commit }, routeOrTrackname) {
        let route, trackname;
        if (typeof routeOrTrackname === 'string') {
            route = this.getters.currentRoute;
            trackname = routeOrTrackname;
            commit('tracknameUpdate', trackname);
        } else {
            route = routeOrTrackname;
            trackname = route.trackname;
        }
        console.log('trackname, route', trackname, route);
        Lockr.sadd('routes', trackname);
        Lockr.set(`route_${trackname}`, route);
        commit('routesUpdate', Lockr.smembers('routes'));
    },
    routeLoad({ commit }, trackname) {
        const route = Lockr.get(`route_${trackname}`);
        commit('routeLoad', route);
    },
    routeRemove({ commit, dispatch }, trackname) {
        Lockr.srem('routes', trackname);
        Lockr.rm(`route_${trackname}`);
        commit('routesUpdate', Lockr.smembers('routes'));
        if (trackname == this.getters.currentRoute.trackname) {
            dispatch('routeClear');
        }
    }
};
