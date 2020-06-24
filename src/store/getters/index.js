import Lockr from 'lockr';

export const getter = {
    currentRoute(state) {
        return {
            trackname: state.trackname,
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
    }
};
