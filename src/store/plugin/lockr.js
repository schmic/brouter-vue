import Lockr from 'lockr';

Lockr.prefix = 'brtr_';

const stateKeys = ['trackname', 'alternativeIdx', 'profile', 'waypoints', 'nogos', 'pois'];

const LockrPlugin = store => {
    store.subscribe((mutation, state) => {
        console.log('LockrPlugin: mutation, state', mutation, state);
    });
    store.subscribe((mutation, state) => {
        if (mutation.type !== 'routeLoad') return;
        stateKeys.forEach(it => Lockr.set(`state/${it}`, state[it]));
    });
    store.subscribe((mutation, state) => {
        ['trackname', 'alternativeIdx', 'profile']
            .filter(type => mutation.type.startsWith(type))
            .forEach(it => Lockr.set(`state/${it}`, state[it]));

        if (['poiUpdate', 'poiRemove', 'poisUpdate'].includes(mutation.type)) {
            const stateKey = 'pois';
            Lockr.set(
                `state/${stateKey}`,
                state[stateKey].map(poi => poi.serialize())
            );
        }
        if (['nogoUpdate', 'nogoRemove', 'nogosUpdate'].includes(mutation.type)) {
            const stateKey = 'nogos';
            Lockr.set(
                `state/${stateKey}`,
                state[stateKey].map(nogo => nogo.serialize())
            );
        }
        if (['waypointUpdate', 'waypointRemove', 'waypointsUpdate'].includes(mutation.type)) {
            const stateKey = 'waypoints';
            Lockr.set(
                `state/${stateKey}`,
                state[stateKey].map(waypoint => waypoint.serialize())
            );
        }
    });
};

export default LockrPlugin;
