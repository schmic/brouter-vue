export default class NoGo {
    constructor(leafletObject) {
        let latlng = { lat: leafletObject.getLatLng().lat, lng: leafletObject.getLatLng().lng };
        this.id = leafletObject._leaflet_id;
        this.name = 'TODO: NoGo name';
        this.latlng = latlng;
        this.radius = leafletObject.getRadius();
    }

    equalsTo(nogo) {
        return this.id == nogo.id || (this.latlng.lat == nogo.latlng.lat && this.latlng.lng == nogo.latlng.lng);
    }

    toString() {
        return `id:${this.id}, name:${this.name}, latlng:${this.latlng}, radius:${this.radius}`;
    }
}
