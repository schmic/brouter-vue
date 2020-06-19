<template>
    <article class="message is-dark">
        <div class="message-header">
            Route
        </div>
        <div class="message-body">
            <div class="field has-addons">
                <div class="control is-expanded">
                    <input v-model="trackname" class="input" type="text" placeholder="Enter route name ..." />
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
                        title="Download route"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="exportModalShow"
                    >
                        <span class="icon"> <i class="fas fa-file-download"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button
                        class="button is-primary"
                        title="Share route"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="shareModalShow"
                    >
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
                                    v-model="trackname"
                                    class="input"
                                    type="text"
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
                                <input id="checkbox" v-model="modal.export.includePOIs" type="checkbox" />
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
            <div id="modal-share" class="modal" :class="{ 'is-active': modal.share.show }">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Share Route</p>
                        <button class="delete" aria-label="close" @click="shareModalHide"></button>
                    </header>
                    <section class="modal-card-body left-align">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input v-model="modal.share.url" class="input" type="text" placeholder="Share URL" />
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" @click="shareRouteTrigger">
                            Copy to clipboard
                        </button>
                    </footer>
                </div>
            </div>
            <a id="dummyDownload" href=""></a>
            <input id="dummyClipboard" name="dummy" type="hidden" />
        </div>
    </article>
</template>

<script>
import { getRouteDownload } from '@/util/BRouter';

export default {
    data() {
        return {
            modal: {
                export: {
                    show: false,
                    format: 'gpx',
                    includePOIs: false
                },
                share: {
                    show: false,
                    includePOIs: true,
                    url: ''
                }
            },
            trackname: undefined
        };
    },
    methods: {
        shareModalShow() {
            this.modal.share.show = true;
            let shareUrl = getRouteDownload(this.trackname, this.modal.share).split('?')[1];
            this.modal.share.url = `${location.href}?share=${shareUrl}`;
        },
        shareModalHide() {
            this.modal.share.show = false;
        },
        shareRouteTrigger() {
            console.log(`shareUrl: ${this.modal.share.url}`);

            var copyText = document.getElementById('dummyClipboard');
            copyText.type = 'text';
            copyText.value = this.modal.share.url;
            copyText.select();
            document.execCommand('copy');
            copyText.type = 'hidden';
            copyText.value = '';

            this.shareModalHide();
        },
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
        }
    }
};
</script>

<style>
.modal {
    z-index: 500;
    text-align: left;
}
</style>
