<template>
    <article class="message is-dark">
        <div class="message-header">
            Route
        </div>
        <div class="message-body">
            <div class="field has-addons">
                <div class="control is-expanded">
                    <input class="input" type="text" v-model="trackname" placeholder="Enter route name ..." />
                </div>
                <div class="control">
                    <button disabled class="button is-primary" title="Load">
                        <span class="icon"> <i class="fa fa-upload"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button disabled class="button is-primary" title="Save">
                        <span class="icon"> <i class="fa fa-download"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button
                        class="button is-primary"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="exportModalShow"
                        title="Download route"
                    >
                        <span class="icon"> <i class="fas fa-file-download"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button class="button is-primary" @click="shareRouteToClipboard" title="Share route">
                        <span class="icon"> <i class="fa fa-share"></i></span>
                    </button>
                </div>
            </div>
            <div id="modal-export" class="modal" :class="{ 'is-active': modal.export.show }">
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
                                <input
                                    class="input"
                                    type="text"
                                    v-model="trackname"
                                    placeholder="Enter route name ..."
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Format</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="modal.export.format">
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
                                <input type="checkbox" id="checkbox" v-model="modal.export.includePOIs" />
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" @click="exportRouteTrigger">
                            Export
                        </button>
                        <!-- <button class="button" @click="exportModalHide">Cancel</button> -->
                    </footer>
                </div>
            </div>
            <a id="dummyDownload" href=""></a>
            <input id="dummyClipboard" name="dummy" type="hidden" />
        </div>
    </article>
</template>

<script>
import { getRouteUrl, getRouteDownload } from '@/util/BRouter';

export default {
    data() {
        return {
            modal: {
                export: {
                    show: false,
                    format: 'gpx',
                    includePOIs: false
                }
            },
            trackname: undefined
        };
    },
    methods: {
        exportModalShow() {
            this.modal.export.show = true;
        },
        exportModalHide() {
            this.modal.export.show = false;
        },
        exportRouteTrigger() {
            const a = document.getElementById('dummyDownload');
            a.href = getRouteDownload(this.trackname, this.modal.export);
            a.click();
            a.href = '#';
            this.exportModalHide();
        },
        shareRouteToClipboard() {
            let shareUrl = getRouteUrl(
                this.$store.state.waypoints.map(waypoint => waypoint.latlng),
                this.$store.state.nogos
            );
            shareUrl = `${location.href}?share=${shareUrl}`;

            var copyText = document.getElementById('dummyClipboard');
            copyText.type = 'text';
            copyText.value = shareUrl;
            copyText.select();
            document.execCommand('copy');
            copyText.type = 'hidden';
            copyText.value = '';

            console.log(`shareUrl: ${shareUrl}`);
        }
    },
    computed: {}
};
</script>

<style>
.modal {
    z-index: 500;
    text-align: left;
}
</style>
