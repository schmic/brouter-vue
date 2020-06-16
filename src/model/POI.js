export default class POI {
    constructor(leafletObject) {
        let latlng = { lat: leafletObject.getLatLng().lat, lng: leafletObject.getLatLng().lng };
        this.id = leafletObject._leaflet_id;
        this.name = 'TODO:  Name';
        this.latlng = latlng;
    }

    equalsTo(nogo) {
        return this.id == nogo.id || (this.latlng.lat == nogo.latlng.lat && this.latlng.lng == nogo.latlng.lng);
    }

    toString() {
        return `id:${this.id}, name:${this.name}, latlng:${this.latlng}`;
    }
}
