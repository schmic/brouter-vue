import { buildUrl, splitUrl, getRouteShare } from '../../src/util/BRouter';

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

    describe('share urls', () => {
        it('are good', () => {
            let fetchURL = getRouteShare(state);
            expect(fetchURL).toContain('format=geojson');
        });

        it('are splitting', () => {
            const share =
                'http://localhost:8080/#/route?share=eyJ0cmFja25hbWUiOiJlcmdlcmciLCJhbHRlcm5hdGl2ZUlkeCI6MCwicHJvZmlsZSI6ImZhc3RiaWtlIiwid2F5cG9pbnRzIjpbeyJpZCI6MTE4LCJsYXRsbmciOnsibGF0Ijo0OS41OTc5NjksImxuZyI6OC41OTQ1MjcsImFsdCI6OTUuNX0sIm9wdGlvbnMiOnsidHlwZSI6IndheXBvaW50IiwiaWNvbiI6eyJvcHRpb25zIjp7Imljb24iOiJtYXAtc2lnbnMiLCJtYXJrZXJDb2xvciI6ImJsdWUiLCJwcmVmaXgiOiJmYSJ9LCJfaW5pdEhvb2tzQ2FsbGVkIjp0cnVlfSwiY29sb3JOYW1lIjoiYmx1ZSJ9fSx7ImlkIjoxMjMsImxhdGxuZyI6eyJsYXQiOjQ5Ljc0NzU1NiwibG5nIjo4LjU5NjE2LCJhbHQiOjk1fSwib3B0aW9ucyI6eyJ0eXBlIjoid2F5cG9pbnQiLCJpY29uIjp7Im9wdGlvbnMiOnsiaWNvbiI6Im1hcC1zaWducyIsIm1hcmtlckNvbG9yIjoiYmx1ZSIsInByZWZpeCI6ImZhIn0sIl9pbml0SG9va3NDYWxsZWQiOnRydWV9LCJjb2xvck5hbWUiOiJibHVlIn19LHsiaWQiOjEyOSwibGF0bG5nIjp7ImxhdCI6NDkuODMwOTEyLCJsbmciOjguNjU4NDE0LCJhbHQiOjE5MX0sIm9wdGlvbnMiOnsidHlwZSI6IndheXBvaW50IiwiaWNvbiI6eyJvcHRpb25zIjp7Imljb24iOiJtYXAtc2lnbnMiLCJtYXJrZXJDb2xvciI6ImJsdWUiLCJwcmVmaXgiOiJmYSJ9LCJfaW5pdEhvb2tzQ2FsbGVkIjp0cnVlfSwiY29sb3JOYW1lIjoiYmx1ZSJ9fSx7ImlkIjoxMzUsImxhdGxuZyI6eyJsYXQiOjQ5Ljg5NzcsImxuZyI6OC41NDQyODQsImFsdCI6OTZ9LCJvcHRpb25zIjp7InR5cGUiOiJ3YXlwb2ludCIsImljb24iOnsib3B0aW9ucyI6eyJpY29uIjoibWFwLXNpZ25zIiwibWFya2VyQ29sb3IiOiJibHVlIiwicHJlZml4IjoiZmEifSwiX2luaXRIb29rc0NhbGxlZCI6dHJ1ZX0sImNvbG9yTmFtZSI6ImJsdWUifX1dLCJub2dvcyI6W3siaWQiOjE0NSwibmFtZSI6IlRPRE86IE5vR28gbmFtZSIsImxhdGxuZyI6eyJsYXQiOjQ5Ljc3NDk1Mjc0MjQxMDQ5LCJsbmciOjguNzQzOTQxMTQxMTUxMTM3fSwicmFkaXVzIjoyNTAwfV0sInBvaXMiOlt7ImlkIjoxNDksIm5hbWUiOiJUT0RPOiAgTmFtZSIsImxhdGxuZyI6eyJsYXQiOjQ5Ljc4NDcwODc5MDg5OTY4LCJsbmciOjguNDg1NzEwNDc4NjUxNjI0fX1dLCJzdGF0cyI6eyJkaXN0YW5jZSI6NTIyNjcsInRvdGFsdGltZSI6MTA1MzIsImZvcm1hdHRlZHRpbWUiOiIyOjU1IiwiYXNjZW5kIjozNDMsImRlc2NlbmQiOjM0Mn19';
            // let fetchURL = getRouteShare(state);
            // expect(importState).toContain('format=geojson');
        });
    });
});
