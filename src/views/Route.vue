<template>
    <div class="container">
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Routes
                    </h1>
                    <h2 class="subtitle">
                        ...
                    </h2>
                </div>
            </div>
        </section>
        <article v-if="routeNames.length == 0" class="message is-info">
            <div class="message-header">
                <p>Hint</p>
            </div>
            <div class="message-body">
                You did not save any route yet. <br />
                Got to the <a href="#" class="href" @click="$router.push('map')"> Map view</a>, create one and then save
                it.
            </div>
        </article>

        <route-card v-for="(routeName, index) in routeNames" :key="index" :route-name="routeName"></route-card>
        <div id="modal-import" class="modal" :class="{ 'is-active': modal.import.show }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Import Route</p>
                    <button class="delete" aria-label="close" @click="importModalHide"></button>
                </header>
                <section class="modal-card-body left-align">
                    <div class="field">
                        <h1><span class="strong"></span>Attention, this will replace your current route!</h1>
                    </div>
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input
                                v-model="modal.import.trackname"
                                class="input"
                                type="text"
                                placeholder="Import route as ..."
                            />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="importRouteClick">
                        Import
                    </button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import RouteCard from '@/components/RouteCard';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        RouteCard
    },
    data() {
        return {
            modal: {
                import: {
                    show: false,
                    trackname: undefined
                }
            }
        };
    },
    computed: {
        ...mapGetters(['routeNames'])
    },
    created() {
        if (this.$route.query.share) {
            this.importModalShow();
        }
    },
    methods: {
        ...mapActions(['routeSave']),
        importModalShow() {
            const share = JSON.parse(atob(this.$route.query.share));
            this.modal.import.trackname = share.trackname || `Import - ` + new Date().toISOString();
            this.modal.import.show = true;
        },
        importModalHide() {
            this.modal.import.show = false;
        },
        importRouteClick() {
            this.importModalHide();
            const importRoute = JSON.parse(atob(this.$route.query.share));
            importRoute.trackname = this.modal.import.trackname;
            console.log('importRoute', importRoute);
            this.routeSave(importRoute);
        }
    }
};
</script>
