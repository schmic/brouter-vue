<template>
    <area-chart
        class="title"
        :data="datacollection"
        :colors="['rgba(20,20,200,.7)']"
        :dataset="{ backgroundColor: 'rgba(20,20,128,.3)', radius: 2 }"
        :legend="true"
    ></area-chart>
</template>

<script>
export default {
    data() {
        return {
            datacollection: []
        };
    },
    computed: {
        segments: {
            get() {
                return this.$store.state.segments;
            }
        }
    },
    watch: {
        segments() {
            this.fillData();
        }
    },
    methods: {
        fillData() {
            this.resetData();
            let distance = 0;
            let nextDistance = 0;
            this.segments.forEach(segment => {
                segment.options.properties.messages.forEach((message, index) => {
                    if (index == 0) return;
                    if (distance >= nextDistance) {
                        this.datacollection[0].data[nextDistance] = message[2];
                        nextDistance += 2;
                    }
                    distance = distance + parseInt(message[3]) / 1000;
                });
            });
            console.log('this.datacollection', this.datacollection);
        },
        resetData() {
            this.datacollection = [
                {
                    name: 'Height',
                    data: {}
                }
            ];
        }
    }
};
</script>
