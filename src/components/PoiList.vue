<template>
    <article class="message is-dark">
        <div class="message-header">
            POIs
        </div>
        <div class="message-body">
            <table class="table is-fullwidth">
                <tr>
                    <th>Name</th>
                    <th>Lat</th>
                    <th>Lng</th>
                    <th></th>
                </tr>
                <tr v-for="(poi, index) in pois" :key="poi.id">
                    <td>
                        <span> {{ poi.name ? poi.name.substring(0, 16) : index + 1 }} </span>
                    </td>
                    <td>
                        <span> {{ poi.latlng.lat.toFixed(5) }} </span>
                    </td>
                    <td>
                        <span> {{ poi.latlng.lng.toFixed(5) }} </span>
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
