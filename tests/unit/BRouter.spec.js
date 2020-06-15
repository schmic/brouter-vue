import { buildUrl, getRouteUrl, readRouteUrl } from '@/util/BRouter';
import store from '@/store';
import stateMock from '../state.mock';

const url = {
    parts: {
        lonlats: '&lonlats=8.617215,49.678107|8.648836,49.768117',
        nogos: '&nogos=8.689295,49.641356,2500|8.724315,49.709378,2500',
        shared:
            'cHJvZmlsZT1mYXN0YmlrZSZhbHRlcm5hdGl2ZWlkeD0wJmZvcm1hdD1nZW9qc29uJm5vZ29zPTguNjg5Mjk1LDQ5LjY0MTM1NiwyNTAwfDguNzI0MzE1LDQ5LjcwOTM3OCwyNTAwJmxvbmxhdHM9OC42MTcyMTUsNDkuNjc4MTA3fDguNjQ4ODM2LDQ5Ljc2ODExNw'
    }
};

describe('BRouter', () => {
    beforeEach(() => {
        store.commit('stateMerge', stateMock);
    });
    it('state is correct', () => {
        expect(store.state.waypoints.length).toBe(3);
        expect(store.state.nogos.length).toBe(2);
    });

    it('generates URL with lonlats', () => {
        let from = store.state.waypoints[0];
        let to = store.state.waypoints[1];
        let fetchURL = buildUrl([from.latlng, to.latlng]);
        expect(fetchURL).toContain(url.parts.lonlats);
    });

    it('generates URL with lonlats and nogos', () => {
        let from = store.state.waypoints[0];
        let to = store.state.waypoints[1];
        let nogos = store.state.nogos;
        let fetchURL = buildUrl([from.latlng, to.latlng], nogos);
        expect(fetchURL).toContain(url.parts.lonlats);
        expect(fetchURL).toContain(url.parts.nogos);
    });

    it('get shared URL', () => {
        let from = store.state.waypoints[0];
        let to = store.state.waypoints[1];
        let nogos = store.state.nogos;
        let fetchURL = getRouteUrl([from.latlng, to.latlng], nogos);
        expect(fetchURL).toMatch(url.parts.shared);
    });

    it('read shared URL', () => {
        let route = readRouteUrl(url.parts.shared);
        expect(route).toMatchObject({ format: 'geojson' });
        expect(route).toMatchObject({ alternativeidx: '0' });
        expect(route).toMatchObject({
            nogos: store.state.nogos.map(nogo => {
                delete nogo.id;
                delete nogo.name;
                return nogo;
            })
        });
    });
});
