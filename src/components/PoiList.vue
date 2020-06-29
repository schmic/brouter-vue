<template>
    <article class="message is-primary">
        <div class="message-header">
            POIs
        </div>
        <div class="message-body">
            <div v-if="!pois.length" class="notification is-warning">
                No POIs yet, use the
                <span class="icon">
                    <i class="fas fa-map-marker-alt"></i>
                </span>
                icon in the toolbar of the map create some.
            </div>
            <table v-if="pois.length" class="table is-fullwidth">
                <tr>
                    <th>Name</th>
                    <th>Lat / Lng</th>
                    <th></th>
                </tr>
                <tr
                    v-for="(poi, index) in pois"
                    :key="poi.id"
                    :class="{ hover: poi.hover }"
                    @mouseenter="onHover(poi, true)"
                    @mouseleave="onHover(poi, false)"
                >
                    <td>
                        <span> {{ poi.name ? poi.name : index + 1 }} </span>
                    </td>
                    <td>
                        <span> {{ poi.latlng.lat.toFixed(6) }} </span>
                        /
                        <span> {{ poi.latlng.lng.toFixed(6) }} </span>
                    </td>
                </tr>
            </table>
        </div>
    </article>
</template>

<script>
export default {
    computed: {
        pois() {
            return this.$store.state.pois;
        }
    },
    methods: {
        onHover(poi, isHover) {
            if (isHover) {
                poi.l.bindTooltip(poi.name).openTooltip();
            } else {
                poi.l.closeTooltip();
            }
        }
    }
};
</script>

<style>
tr:hover {
    background-color: rgb(212, 212, 212);
    cursor: default;
}
</style>
