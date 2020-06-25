import { buildUrl } from '../../src/util/BRouter';

import state from '../state.mock';

const url = {
    parts: {
        lonlats: '&lonlats=8.418889,49.638158|8.530293,49.650839',
        nogos: '&nogos=8.654321,49.654321,2500|8.123456,49.123456,1200',
        shared:
            'cHJvZmlsZT1mYXN0YmlrZSZhbHRlcm5hdGl2ZWlkeD0wJmZvcm1hdD1nZW9qc29uJm5vZ29zPTguNjg5Mjk1LDQ5LjY0MTM1NiwyNTAwfDguNzI0MzE1LDQ5LjcwOTM3OCwyNTAwJmxvbmxhdHM9OC42MTcyMTUsNDkuNjc4MTA3fDguNjQ4ODM2LDQ5Ljc2ODExNw'
    }
};

const lonlats = [state.waypoints[0].latlng, state.waypoints[1].latlng];
const nogos = state.nogos;
const pois = state.waypoints;

describe('BRouter', () => {
    beforeEach(() => {});

    it('state is correct', () => {
        expect(state.waypoints.length).toBe(6);
        expect(state.nogos.length).toBe(2);
    });

    describe('segment urls', () => {
        it('should contain lonlats', () => {
            let fetchURL = buildUrl(lonlats);
            expect(fetchURL).toContain(url.parts.lonlats);
        });

        it('should contain lonlats and nogos', () => {
            let fetchURL = buildUrl(lonlats, nogos);
            expect(fetchURL).toContain(url.parts.lonlats);
            expect(fetchURL).toContain(url.parts.nogos);
        });
    });

    describe('download urls', () => {
        it('should export as gpx', () => {
            let fetchURL = buildUrl(lonlats, nogos, pois, { format: 'gpx' });
            expect(fetchURL).toContain('format=gpx');
        });
    });
});
