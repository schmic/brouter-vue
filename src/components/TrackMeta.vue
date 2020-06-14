<template>
    <article class="message is-grey">
        <div class="message-header">
            Statistic
        </div>
        <div class="message-body">
            <nav class="level is-mobile">
                <div class="level-item has-text-centered">
                    <i class="fa fa-route"></i>
                    {{ (trackStats.distance / 1000).toFixed(2) }} km
                </div>
                <div class="level-item has-text-centered">
                    <i class="far fa-clock"></i> {{ trackStats.formattedtime }} h
                </div>
                <div class="level-item has-text-centered">
                    <i class="fa fa-angle-double-up"></i> {{ trackStats.ascend.toFixed(0) }} m
                </div>
                <div class="level-item has-text-centered">
                    <i class="fa fa-angle-double-down"></i> {{ trackStats.descend.toFixed(0) }} m
                </div>
            </nav>
        </div>
    </article>
</template>

<script>
export default {
    computed: {
        trackStats() {
            return this.$store.state.stats;
        }
    }
};
</script>

<style>
.level-item > i.fa,
.level-item > i.far,
.level-item > i.fas {
    margin-right: 8px;
}
</style>
