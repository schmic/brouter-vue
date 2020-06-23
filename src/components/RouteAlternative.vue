<template>
    <div class="field has-addons">
        <p v-for="alternative in alternatives" :key="alternative" class="control" @click="active = alternative">
            <button class="button" :class="{ 'is-primary': alternative == active }">
                <!-- <span class="icon is-small">
                    <i class="fas fa-align-left"></i>
                </span> -->
                <span>{{ alternative + 1 }}</span>
            </button>
        </p>
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
