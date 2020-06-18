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
                        @click="downloadRoute"
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
            <div class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Modal title</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <!-- Content ... -->
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success">Save changes</button>
                        <button class="button">Cancel</button>
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
            trackname: undefined
        };
    },
    methods: {
        downloadRoute() {
            console.log('this.trackname', this.trackname);

            const a = document.getElementById('dummyDownload');
            a.href = getRouteDownload(this.trackname);
            a.click();
            a.href = '#';
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

<style></style>
