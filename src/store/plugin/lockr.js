import Lockr from 'lockr';

Lockr.prefix = 'brtr_';

const LockrPlugin = store => {
    // store.subscribe((mutation, state) => {
    //     console.log('LockrPlugin: mutation, state', mutation, state);
    // });
    store.subscribe((mutation, state) => {
        if (mutation.type !== 'routeLoad') return;
        ['trackname', 'alternativeIdx', 'profile', 'waypoints', 'nogos', 'pois'].forEach(it =>
            Lockr.set(`state/${it}`, state[it])
        );
    });

    store.subscribe((mutation, state) => {
        ['trackname', 'alternativeIdx', 'profile', 'waypoints', 'nogos', 'pois']
            .filter(type => mutation.type.startsWith(type))
            .forEach(it => Lockr.set(`state/${it}`, state[it]));
    });
};

export default LockrPlugin;
