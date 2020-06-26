<template>
    <div id="modal-export" class="modal" :class="{ 'is-active': show }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Export Route</p>
                <button class="delete" aria-label="close" @click="exportModalHide"></button>
            </header>
            <section class="modal-card-body left-align">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input v-model="trackname" class="input" type="text" placeholder="Enter route name ..." />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Format</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="format">
                                <option disabled value="">Please select export format</option>
                                <option value="gpx">GPX</option>
                                <option value="kml">KML</option>
                                <option value="geojson">GeoJSON</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="checkbox"> Include POIs</label>
                    <div class="control">
                        <input id="checkbox" v-model="includePOIs" type="checkbox" />
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="exportRouteTrigger">
                    Export
                </button>
            </footer>
        </div>
        <a id="dummyDownload" href=""></a>
    </div>
</template>

<script>
import { getRouteDownload } from '@/util/BRouter';
import { mapGetters } from 'vuex';

export default {
    props: { show: { type: Boolean, required: true } },
    data() {
        return {
            trackname: undefined,
            format: 'gpx',
            includePOIs: false
        };
    },
    watch: {
        show() {
            if (this.show) {
                this.trackname = this.currentRoute().trackname;
            } else {
                this.trackname = undefined;
            }
        }
    },
    methods: {
        ...mapGetters(['currentRoute']),
        exportModalHide() {
            this.$emit('hide');
        },
        exportRouteTrigger() {
            const a = document.getElementById('dummyDownload');
            a.href = getRouteDownload(this.trackname, { format: this.format, includePOIs: this.includePOIs });
            a.click();
            a.href = '#';
            this.exportModalHide();
        }
    }
};
</script>
