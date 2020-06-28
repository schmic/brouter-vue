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
                <tr v-for="(poi, index) in pois" :key="poi.id">
                    <td>
                        <span> {{ poi.name ? poi.name.substring(0, 16) : index + 1 }} </span>
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
    }
};
</script>

<style></style>
