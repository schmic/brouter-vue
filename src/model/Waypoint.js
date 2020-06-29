import store from '../store';
import { uuid } from 'uuidv4';
export default class Waypoint {
    constructor(l, id) {
        this.l = l;
        this.id = id || uuid();
    }
    get latlng() {
        return this.l.getLatLng();
    }

    get options() {
        return {
            draggable: this.l.options.draggable,
            type: this.l.options.type,
            colorName: this.l.options.colorName
        };
    }

    equalsTo(waypoint) {
        return (
            this.id == waypoint.id || (this.latlng.lat == waypoint.latlng.lat && this.latlng.lng == waypoint.latlng.lng)
        );
    }

    serialize() {
        return {
            id: this.id,
            latlng: this.latlng,
            options: this.options
        };
    }

    toString() {
        return `id:${this.id}, latlng:${this.latlng}, type:${this.options.type}`;
    }
}

export const createWaypoint = _waypoint => {
    console.log('createWaypoint', _waypoint);

    const options = {
        ...{
            type: 'waypoint',
            draggable: true,
            icon: window.L.AwesomeMarkers.icon({
                ...{
                    // defaults
                    icon: 'map-marker-alt',
                    prefix: 'fa',
                    markerColor: 'blue'
                },
                ..._waypoint.icon
            })
        },
        ..._waypoint.options
    };

    console.log('options', options);

    let node = window.L.marker(_waypoint.latlng, options);
    let waypoint = new Waypoint(node);
    waypoint.l.on('moveend', () => {
        store.commit('waypointUpdate', waypoint);
    });
    waypoint.l.on('click', evt => {
        window.L.DomEvent.stop(evt);
        if (store.state.toolBarMode == 'delete') {
            store.commit('waypointRemove', waypoint);
        }
    });

    return waypoint;
};
