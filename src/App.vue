<template>
    <div id="app">
        <nav class="navbar is-danger">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <img
                        src="https://bulma.io/images/bulma-logo.png"
                        alt="Bulma: a modern CSS framework based on Flexbox"
                        width="112"
                        height="28"
                    />
                </router-link>
                <a class="navbar-item is-hidden-desktop" href="https://github.com/schmic/fitalyzr" target="_blank">
                    <span class="icon" style="color: #333;">
                        <i class="fab fa-github"></i>
                    </span>
                </a>
                <a class="navbar-item is-hidden-desktop" href="https://twitter.com/theschmic" target="_blank">
                    <span class="icon" style="color: #55acee;">
                        <i class="fab fa-twitter"></i>
                    </span>
                </a>
                <div class="navbar-burger burger" data-target="navMenuTop">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="navMenuTop" class="navbar-menu">
                <div class="navbar-start">
                    <router-link class="navbar-item" to="/map">Map</router-link>
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
                    <a class="navbar-item" href="https://github.com/schmic/brouter-vue" target="_blank">Github</a>
                    <a class="navbar-item" href="https://twitter.com/theschmic" target="_blank">Twitter</a>
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
    </div>
</template>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
