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
        <article v-if="routeList.length == 0" class="message is-info">
            <div class="message-header">
                <p>Hint</p>
            </div>
            <div class="message-body">
                You did not save any route yet. <br />
                Got to the <a href="#" class="href" @click="$router.push('map')"> Map view</a>, create one and then save
                it.
            </div>
        </article>
        <div v-for="route in routeList" :key="route.trackname" class="card">
            <header class="card-header">
                <p class="card-header-title">
                    {{ route.trackname }}
                </p>
                <a href="#" class="card-header-icon" aria-label="more options">
                    <span class="icon">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </a>
            </header>
            <div class="card-content">
                <div class="content">
                    <nav class="level">
                        <div class="level-item has-text-centered">
                            <i class="fa fa-route"></i>
                            {{ (route.stats.distance / 1000).toFixed(2) }} km
                        </div>
                        <div class="level-item has-text-centered">
                            <i class="far fa-clock"></i> {{ route.stats.formattedtime }} h
                        </div>
                        <div class="level-item has-text-centered">
                            <i class="fa fa-angle-double-up"></i> {{ route.stats.ascend.toFixed(0) }} m
                        </div>
                        <div class="level-item has-text-centered">
                            <i class="fa fa-angle-double-down"></i>
                            {{ route.stats.descend.toFixed(0) }} m
                        </div>
                    </nav>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="onRouteLoad(route.trackname)">Load</a>
                <a href="#" class="card-footer-item" @click="onRouteDelete(route.trackname)">Delete</a>
            </footer>
        </div>
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
                    <button class="button is-success" @click="importRouteTrigger">
                        Import
                    </button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
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
        ...mapGetters(['routeList'])
    },
    created() {
        if (this.$route.query.share) {
            this.importModalShow();
        }
    },
    methods: {
        ...mapActions(['routeLoad']),
        onRouteLoad(trackname) {
            console.log('trackname', trackname);
            this.routeLoad(trackname);
            this.$router.push('map');
        },
        onRouteDelete(route) {
            // TODO: move logic to store
            this.routes = JSON.parse(localStorage.getItem('routes') || '[]').filter(_route => route != _route);
            localStorage.setItem('routes', JSON.stringify(this.routes));
            ['waypoints', 'nogos', 'pois', 'trackname'].forEach(it => localStorage.removeItem(`${route}/${it}`));
        },
        importModalShow() {
            this.modal.import.trackname = this.$route.query.trackname
                ? this.$route.query.trackname
                : `Import - ` + new Date().toISOString();
            this.modal.import.show = true;
        },
        importModalHide() {
            this.modal.import.show = false;
        },
        importRouteTrigger() {
            console.log('IMPORT', this.$route.query);
        }
    }
};
</script>

<style scoped>
.level-item {
    margin: 2em 1em;
}
</style>
