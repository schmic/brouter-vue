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
};
