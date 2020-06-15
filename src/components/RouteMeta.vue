<template>
    <article class="message is-dark">
        <div class="message-header">
            Route
        </div>
        <div class="message-body">
            <div class="field has-addons">
                <div class="control is-expanded">
                    <input class="input" type="text" placeholder="Route Name" />
                </div>
                <div class="control">
                    <button class="button is-primary" title="Save">
                        <span class="icon"> <i class="fa fa-save"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button class="button is-primary" @click="shareRouteToClipboard" title="Copy route to clipboard">
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
            <input id="dummy" name="dummy" type="hidden" />
        </div>
    </article>
</template>

<script>
import { getRouteUrl } from '@/util/BRouter';

export default {
    methods: {
        shareRouteToClipboard() {
            let shareUrl = getRouteUrl(
                this.$store.state.waypoints.map(waypoint => waypoint.latlng),
                this.$store.state.nogos
            );
            shareUrl = `${location.href}?share=${shareUrl}`;

            var copyText = document.getElementById('dummy');
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
