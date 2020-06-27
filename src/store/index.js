import Vue from 'vue';
import Vuex from 'vuex';

import Lockr from 'lockr';
import LockrPlugin from './plugin/lockr';

import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

import { createPOI } from '../model/POI';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [LockrPlugin],
    state: {
        trackname: Lockr.get('state/trackname', undefined),
        alternativeIdx: Lockr.get('state/alternativeIdx', 0),
        profile: Lockr.get(`state/profile`, 'fastbike'),
        waypoints: Lockr.get('state/waypoints', []),
        nogos: Lockr.get('state/nogos', []),
        pois: Lockr.get('state/pois', []).map(poi => createPOI(poi)),
        stats: {
            distance: 0,
            totaltime: 0,
            formattedtime: '0:00',
            ascend: 0,
            descend: 0
        },
        toolBarMode: undefined,
        routes: Lockr.get('routes', [])
    },
    mutations,
    actions,
    getters
});
