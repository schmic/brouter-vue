<template>
    <article class="message is-grey">
        <div class="message-header">
            Waypoints
        </div>
        <div class="message-body">
            <table class="table is-fullwidth">
                <tr>
                    <th>Name</th>
                    <th>Lat</th>
                    <th>Lng</th>
                    <th></th>
                </tr>
                <tr v-for="(waypoint, index) in waypoints" :key="waypoint.id">
                    <td>
                        <span> {{ waypoint.name ? waypoint.name.substring(0, 16) : index + 1 }} </span>
                    </td>
                    <td>
                        <span> {{ waypoint.latlng.lat.toFixed(5) }} </span>
                    </td>
                    <td>
                        <span> {{ waypoint.latlng.lng.toFixed(5) }} </span>
                    </td>
                </tr>
            </table>
        </div>
    </article>
</template>

<script>
export default {
    computed: {
        waypoints() {
            return this.$store.state.waypoints;
        }
    }
};
</script>

<style></style>
