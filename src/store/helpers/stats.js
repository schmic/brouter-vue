const statsReset = state => {
    state.stats = {
        distance: 0,
        totaltime: 0,
        formattedtime: '0:00',
        ascend: 0,
        descend: 0
    };
};

const statsCalc = state => {
    state.stats.distance = state.segments.map(segment => segment.distance).reduce((a, b) => a + b, 0);
    state.stats.totaltime = state.segments.map(segment => segment.duration).reduce((a, b) => a + b, 0);
    state.stats.formattedtime =
        Math.trunc(state.stats.totaltime / 3600) +
        ':' +
        ('0' + Math.trunc((state.stats.totaltime % 3600) / 60)).slice(-2);
    state.stats.ascend = state.segments.map(segment => segment.ascend).reduce((a, b) => a + b, 0);
    state.stats.descend = state.segments.map(segment => segment.descend).reduce((a, b) => a + b, 0);
};

export { statsReset, statsCalc };
