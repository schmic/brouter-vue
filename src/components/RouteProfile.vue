<template>
    <div class="field has-addons">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Profile</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <div class="select">
                            <select v-model="profile">
                                <option disabled value="">Please select profile</option>
                                <option v-for="p in profiles" :key="p" :value="p">{{
                                    $t(`routing.profiles.${p}`)
                                }}</option>
                            </select>
                        </div>
                    </div>
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
            profiles: [
                'car-eco',
                'car-eco-de',
                'car-eco-suspect_scan',
                'car-fast',
                'car-test',
                'car-vario',
                'fastbike-asia-pacific',
                'fastbike',
                'fastbike-lowtraffic',
                'fastbike-verylowtraffic',
                'hiking-beta',
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
