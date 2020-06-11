import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false;
Vue.config.devtools = false;

console.log('[i] Starting client app');

new Vue({
    router,
    store,
    render: function(h) {
        return h(App);
    }
}).$mount('#app');
