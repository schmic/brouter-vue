export default class Waypoint {
    constructor(id, name, latlng, options) {
        this.id = id;
        this.latlng = latlng;
        this.options = options;
    }

    toString() {
        return `id:${this.id}, latlng:${this.latlng}, type:${this.options.type}`;
    }
}
