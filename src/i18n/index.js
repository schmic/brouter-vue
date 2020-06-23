import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en: {
            routing: {
                profiles: {
                    'car-eco': 'Car (economic)',
                    'car-eco-de': 'Car (economic, german)',
                    'car-eco-suspect_scan': 'Car (economic, Suspect Scan)',
                    'car-fast': 'Car (fast)',
                    'car-test': 'Car (test)',
                    'car-vario': 'Car (vario)',
                    custom: 'Custom',
                    fastbike: 'Fastbike',
                    'fastbike-asia-pacific': 'Fastbike (Asia Pacific)',
                    'fastbike-lowtraffic': 'Fastbike (low traffic)',
                    'fastbike-verylowtraffic': 'Fastbike (very low traffic)',
                    'hiking-beta': 'Hiking (beta)',
                    moped: 'Moped',
                    rail: 'Rail',
                    river: 'River',
                    safety: 'Safety',
                    shortest: 'Shortest',
                    trekking: 'Trekking bike',
                    'trekking-ignore-cr': 'Trekking bike (ignore cycle routes)',
                    'trekking-noferries': 'Trekking bike (no ferries)',
                    'trekking-nosteps': 'Trekking bike (no steps)',
                    'trekking-steep': 'Trekking bike (steep)',
                    'vm-forum-liegerad-schnell': 'Recumbent bike (fast)',
                    'vm-forum-velomobil-schnell': 'Velomobile (fast)'
                }
            }
        }
    }
});

export default i18n;
