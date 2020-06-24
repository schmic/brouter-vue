import { buildUrl } from '../../src/util/BRouter';

import state from '../state.mock';

const url = {
    parts: {
        lonlats: '&lonlats=8.617215,49.678107|8.648836,49.768117',
        nogos: '&nogos=8.689295,49.641356,2500|8.724315,49.709378,2500',
        shared:
            'cHJvZmlsZT1mYXN0YmlrZSZhbHRlcm5hdGl2ZWlkeD0wJmZvcm1hdD1nZW9qc29uJm5vZ29zPTguNjg5Mjk1LDQ5LjY0MTM1NiwyNTAwfDguNzI0MzE1LDQ5LjcwOTM3OCwyNTAwJmxvbmxhdHM9OC42MTcyMTUsNDkuNjc4MTA3fDguNjQ4ODM2LDQ5Ljc2ODExNw'
    }
};

describe('BRouter', () => {
    beforeEach(() => {});

    it('state is correct', () => {
        expect(state.waypoints.length).toBe(3);
        expect(state.nogos.length).toBe(2);
    });

    it('generates URL with lonlats', () => {
        let from = state.waypoints[0];
        let to = state.waypoints[1];
        let fetchURL = buildUrl([from.latlng, to.latlng]);
        expect(fetchURL).toContain(url.parts.lonlats);
    });

    it('generates URL with lonlats and nogos', () => {
        let from = state.waypoints[0];
        let to = state.waypoints[1];
        let nogos = state.nogos;
        let fetchURL = buildUrl([from.latlng, to.latlng], nogos);
        expect(fetchURL).toContain(url.parts.lonlats);
        expect(fetchURL).toContain(url.parts.nogos);
    });
});
