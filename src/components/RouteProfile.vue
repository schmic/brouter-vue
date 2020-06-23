<template>
    <div class="select">
        <select v-model="profile">
            <option disabled value="">Please select profile</option>
            <option v-for="p in profiles" :key="p">{{ p }}</option>
        </select>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            profiles: [
                'car-eco',
                'car-eco-de',
                'car-eco-suspect_scan',
                'car-fast',
                'car-test',
                'car-vario',
                'dummy',
                'fastbike-asia-pacific',
                'fastbike',
                'fastbike-lowtraffic',
                'fastbike-verylowtraffic',
                'hiking-beta',
                'lookups',
                'moped',
                'rail',
                'river',
                'safety',
                'shortest',
                'trekking',
                'trekking-ignore-cr',
                'trekking-noferries',
                'trekking-nosteps',
                'trekking-steep',
                'vm-forum-liegerad-schnell',
                'vm-forum-velomobil-schnell'
            ]
        };
    },
    computed: {
        profile: {
            get() {
                return this.$store.state.profile;
            },
            set(value) {
                this.profileUpdate(value);
            }
        }
    },
    methods: {
        ...mapMutations(['profileUpdate'])
    }
};
</script>
