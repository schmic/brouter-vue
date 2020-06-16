export default class Waypoint {
    constructor(id, name, latlng, options, original) {
        this.id = id;
        this.name = name || 'TODO: Name';
        this.latlng = latlng;
        this.options = options;
        this.original = original;

        original && console.log('original', original);
    }

    toString() {
        return `id:${this.id}, name:${this.name}, latlng:${this.latlng}, type:${this.options.type}`;
    }
}
