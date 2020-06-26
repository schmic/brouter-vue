import Lockr from 'lockr';

export const getters = {
    currentRoute(state) {
        return {
            trackname: state.trackname,
            alternativeIdx: state.alternativeIdx,
            profile: state.profile,
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
    },
    routeShareByName: state => trackname => {
        state.routes; // don't need it but must do something
        const route = Lockr.get(`route_${trackname}`);
        return btoa(JSON.stringify(route).replace(' ', ''));
    },
    routeShareCurrent: state => {
        const route = {
            trackname: state.trackname,
            alternativeIdx: state.alternativeIdx,
            profile: state.profile,
            waypoints: state.waypoints,
            nogos: state.nogos,
            pois: state.pois,
            stats: state.stats
        };
        return btoa(JSON.stringify(route).replace(' ', ''));
    }
};
