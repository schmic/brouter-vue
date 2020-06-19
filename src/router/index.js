import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Map from '../views/Map.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/map' },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/map',
        name: 'Map',
        component: Map
    }
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: function() {
    //         return import(/* webpackChunkName: "about" */ '../views/About.vue');
    //     }
    // }
];

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
