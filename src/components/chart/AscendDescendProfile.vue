<script>
import { Line } from 'vue-chartjs';

export default {
    extends: Line,
    data: () => ({
        chartdata: {
            labels: [],
            datasets: [
                {
                    label: 'Ascending',
                    backgroundColor: 'rgba(200,200,20,0.2)',
                    data: [],
                    yAxisID: 'meters'
                },
                {
                    label: 'Descending',
                    backgroundColor: 'rgba(200,20,200,0.2)',
                    data: [],
                    yAxisID: 'meters'
                },
                {
                    label: 'Distance',
                    backgroundColor: 'rgba(20,200,200,0.2)',
                    data: [],
                    yAxisID: 'kilometers'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            lineTension: 1,
            scales: {
                xAxes: [
                    {
                        id: 'foo'
                    },
                    {
                        id: 'distance'
                    }
                ],
                yAxes: [
                    {
                        id: 'meters',
                        ticks: {
                            beginAtZero: true,
                            padding: 10
                        }
                    },
                    {
                        id: 'kilometers',
                        ticks: {
                            beginAtZero: true,
                            padding: 10
                        }
                    }
                ]
            }
        }
    }),
    computed: {
        segments: {
            get() {
                return this.$store.state.segments || [];
            }
        }
    },
    mounted() {
        this.segments.forEach((segment, index) => {
            this.chartdata.labels.push(`Segment ${index + 1}`);
            this.chartdata.datasets[0].data.push(segment.ascend);
            this.chartdata.datasets[1].data.push(segment.descend);
            this.chartdata.datasets[2].data.push(segment.distance / 1000);
        });
        this.renderChart(this.chartdata, this.options);
    }
};
</script>
