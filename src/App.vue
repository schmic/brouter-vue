<template>
    <div id="app">
        <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
            <div id="navMenuBrand" class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    BRouter-Vue <small style="margin-left: 0.5em">v{{ version }}</small></router-link
                >
                <div
                    class="navbar-burger burger"
                    :class="{ 'is-active': navbarIsActive }"
                    @click="navbarIsActive = !navbarIsActive"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="navMenuTop" class="navbar-menu" :class="{ 'is-active': navbarIsActive }">
                <div class="navbar-start">
                    <router-link class="navbar-item" to="/map">Map</router-link>
                    <router-link class="navbar-item" to="/route">Routes</router-link>
                    <router-link class="navbar-item" to="/help">Help</router-link>
                    <!-- <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link is-active" href="#">Docs</a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" href="#">Overview</a>
                            <a class="navbar-item" href="#">Modifiers</a>
                            <a class="navbar-item" href="#">Grid</a>
                            <a class="navbar-item" href="#">Form</a>
                            <a class="navbar-item" href="#">Elements</a>
                            <a class="navbar-item is-active" href="#">Components</a>
                            <a class="navbar-item" href="#">Layout</a>
                            <hr class="navbar-divider" />
                            <div class="navbar-item">
                                <div>
                                    version
                                    <p class="has-text-info is-size-6-desktop">0.4.3</p>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="navbar-item has-dropdown is-hoverable">
                        <div class="navbar-link">More</div>
                        <div id="moreDropdown" class="navbar-dropdown">
                            <a class="navbar-item" href="#extensions/">
                                <div class="level is-mobile">
                                    <div class="level-left">
                                        <div class="level-item">
                                            <p>
                                                <strong>Extensions</strong>
                                                <br />
                                                <small>Side projects to enhance Bulma</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div> -->
                </div>
                <div class="navbar-end">
                    <router-link class="navbar-item" to="/about">About</router-link>
                    <!-- <a class="navbar-item" href="https://github.com/schmic/brouter-vue" target="_blank">
                        <span class="icon" style="color: #333;margin-right: 4px">
                            <i class="fab fa-github"></i>
                        </span>
                        Github
                    </a> -->
                    <!-- <div class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control">
                                <a class="button is-primary" href="https://github.com/jgthms/bulma/archive/0.4.3.zip">
                                    <span class="icon">
                                        <i class="fa fa-download"></i>
                                    </span>
                                    <span>Download</span>
                                </a>
                            </p>
                        </div>
                    </div> -->
                </div>
            </div>
        </nav>
        <section class="section">
            <router-view />
        </section>
        <footer>
            <div class="level">
                <div class="level-item has-text-centered">
                    <div>
                        <p class="title">Footer</p>
                        <p class="heading">way below</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import { version } from '../package.json';
export default {
    data() {
        return {
            navbarIsActive: false,
            version: version
        };
    }
};
</script>
<style>
html,
body {
    height: 100%;
    overflow-x: hidden; /* bulma default */
    overflow-y: auto; /* override bulma default: scroll */
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    min-height: 100%;
    height: 100%;

    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
}

#app > section {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
}

#app > footer {
    display: none;
}
</style>
