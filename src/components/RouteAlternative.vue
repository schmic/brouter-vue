<template>
    <div class="field is-horizontal">
        <div class="field-label">
            <label class="label">Alternative</label>
        </div>
        <div class="field-body">
            <div class="field is-narrow has-addons">
                <div
                    v-for="alternative in alternatives"
                    :key="alternative"
                    class="control"
                    @click="active = alternative"
                >
                    <button class="button" :class="{ 'is-primary': alternative == active }">
                        <span>{{ alternative + 1 }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            alternatives: [0, 1, 2, 3]
        };
    },
    computed: {
        active: {
            get() {
                return this.$store.state.alternativeIdx;
            },
            set(value) {
                this.alternativeIdxUpdate(value);
            }
        }
    },
    methods: {
        ...mapMutations(['alternativeIdxUpdate'])
    }
};
</script>
