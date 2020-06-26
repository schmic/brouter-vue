<template>
    <div id="modal-share" v-shortkey="['esc']" class="modal" :class="{ 'is-active': show }" @shortkey="hide">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Share Route</p>
                <button class="delete" aria-label="close" @click="hide"></button>
            </header>
            <section class="modal-card-body left-align">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input v-model="url" class="input" type="text" placeholder="Share URL" />
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="routeToClipboard">
                    Copy to clipboard
                </button>
            </footer>
        </div>
        <input id="dummyClipboard" name="dummy" type="hidden" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: { show: { type: Boolean, required: true } },
    data() {
        return {
            url: undefined
        };
    },
    watch: {
        show() {
            if (this.show) {
                let shareValue = this.routeShareCurrent();
                this.url = `${location.href.replace('map', 'route')}?share=${shareValue}`;
            } else {
                this.url = undefined;
            }
        }
    },
    methods: {
        ...mapGetters(['routeShareCurrent']),
        hide() {
            this.$emit('hide');
        },
        routeToClipboard() {
            var copyText = document.getElementById('dummyClipboard');
            copyText.type = 'text';
            copyText.value = this.url;
            copyText.select();
            document.execCommand('copy');
            copyText.type = 'hidden';
            copyText.value = '';

            this.hide();
        }
    }
};
</script>
