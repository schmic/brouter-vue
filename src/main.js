import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';

import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import '../css/main.css';

import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';
import 'leaflet-easybutton/src/easy-button';
import 'leaflet-trackdrawer/src/index';
import 'leaflet-editable/src/Leaflet.Editable';

import ShortKey from 'vue-shortkey';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(ShortKey, { prevent: ['input', 'textarea'] });

import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

console.log('[i] Starting client app');

new Vue({
    router,
    i18n,
    store,
    render: function(h) {
        return h(App);
    }
}).$mount('#app');
