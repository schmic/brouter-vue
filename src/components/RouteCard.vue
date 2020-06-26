<template>
    <div class="card">
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
                <div v-if="!route.stats" class="notification">
                    No statistics available for this route.
                </div>
                <nav v-if="route.stats" class="level">
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: { routeName: { type: String, required: true } },
    computed: {
        ...mapGetters(['routeByName']),
        route() {
            return this.routeByName(this.routeName);
        }
    },
    methods: {
        ...mapActions(['routeLoad', 'routeRemove']),
        onRouteLoad(trackname) {
            this.routeLoad(trackname);
            this.$router.push('map');
        },
        onRouteDelete(trackname) {
            this.routeRemove(trackname);
        }
    }
};
</script>
<style scoped>
.level-item {
    margin: 2em 1em;
}
.card {
    margin-bottom: 2em;
}
</style>
