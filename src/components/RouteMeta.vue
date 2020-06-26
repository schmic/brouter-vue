<template>
    <article class="message is-primary">
        <div class="message-header">
            Route
        </div>
        <div class="message-body">
            <div class="field has-addons">
                <div class="control is-expanded">
                    <input v-model="trackname" class="input" type="text" placeholder="Enter route name ..." />
                </div>
                <div class="control">
                    <button
                        class="button is-primary"
                        title="Save"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="routeSaveClick"
                    >
                        <span class="icon"> <i class="fa fa-download"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button
                        class="button is-primary"
                        title="Download current route state"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="showExportModal = true"
                    >
                        <span class="icon"> <i class="fas fa-file-download"></i></span>
                    </button>
                </div>
                <div class="control">
                    <button
                        class="button is-primary"
                        title="Share current route state"
                        :disabled="trackname == undefined || trackname.length == 0"
                        @click="showShareModal = true"
                    >
                        <span class="icon"> <i class="fa fa-share"></i></span>
                    </button>
                </div>
            </div>
            <route-alternative></route-alternative>
            <route-profile></route-profile>

            <route-share-modal :show="showShareModal" @hide="showShareModal = false"></route-share-modal>
            <route-download-modal :show="showExportModal" @hide="showExportModal = false"></route-download-modal>
        </div>
    </article>
</template>

<script>
import { mapActions } from 'vuex';

import RouteAlternative from '@/components/RouteAlternative';
import RouteProfile from '@/components/RouteProfile';
import RouteShareModal from '@/components/RouteShare';
import RouteDownloadModal from '@/components/RouteDownload';

export default {
    components: {
        RouteAlternative,
        RouteProfile,
        RouteShareModal,
        RouteDownloadModal
    },
    data() {
        return {
            showExportModal: false,
            showShareModal: false
        };
    },
    computed: {
        trackname: {
            get() {
                return this.$store.state.trackname;
            },
            set(value) {
                this.$store.commit('tracknameUpdate', value);
            }
        }
    },
    mounted() {},
    methods: {
        ...mapActions(['routeSave']),
        routeSaveClick() {
            this.routeSave(this.trackname);
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
