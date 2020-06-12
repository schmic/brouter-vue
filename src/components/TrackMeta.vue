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
                    <i class="fa fa-angle-double-up"></i> {{ trackStats.ascend }} m
                </div>
                <div class="level-item has-text-centered">
                    <i class="fa fa-angle-double-down"></i> {{ trackStats.descend || 0 }} m
                </div>
            </nav>
        </div>
    </article>
</template>

<script>
export default {
    props: ['trackStats']
};
</script>

<style>
.level-item > i.fa,
.level-item > i.far,
.level-item > i.fas {
    margin-right: 8px;
}
</style>
