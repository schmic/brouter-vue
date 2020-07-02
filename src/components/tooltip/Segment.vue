<template>
    <nav class="level">
        <div class="level-item" style="margin: 0.5em"><i class="fa fa-route"> </i>${segment.distance}km</div>
        <div class="level-item" style="margin: 0.5em"><i class="fa fa-angle-double-up"> </i>${segment.ascend}m</div>
        <div class="level-item" style="margin: 0.5em"><i class="fa fa-angle-double-down"> </i>${segment.descend}m</div>
    </nav>
</template>

<script>
export default {
    props: {
        segment: {
            type: Object,
            required: true
        }
    }
};
</script>
