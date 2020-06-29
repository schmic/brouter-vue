import store from '../store';
import { uuid } from 'uuidv4';

export default class Waypoint {
    constructor(l, id, name) {
        this.l = l;

        this.id = id || uuid();
        this.name = name || `WP ${this.id.substring(1, 16)}`;
    }

    get latlng() {
        return this.l.getLatLng();
    }

    get options() {
        return {
            draggable: this.l.options.draggable,
            type: this.l.options.type
        };
    }

    get icon() {
        return this.l.options.icon.options;
    }

    equalsTo(waypoint) {
        return (
            this.id == waypoint.id || (this.latlng.lat == waypoint.latlng.lat && this.latlng.lng == waypoint.latlng.lng)
        );
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            latlng: this.latlng,
            options: this.options,
            icon: this.icon
        };
    }

    toString() {
        return `id:${this.id}, latlng:${this.latlng}, type:${this.options.type}`;
    }
}

export const createWaypoint = _waypoint => {
    let options = {
        ...{
            // defaults
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
    let waypoint = new Waypoint(window.L.TrackDrawer.node(_waypoint.latlng, options));
    waypoint.l.on('moveend', () => {
        store.commit('waypointUpdate', waypoint);
    });
    waypoint.l.on('click', evt => {
        window.L.DomEvent.stop(evt);
        if (store.state.toolBarMode == 'delete') {
            store.commit('waypointRemove', waypoint);
        }
        if (store.state.toolBarMode == 'promote') {
            store.commit('waypointPromote', waypoint);
            store.commit('waypointUpdate', waypoint);
        }
        if (store.state.toolBarMode == 'demote') {
            store.commit('waypointDemote', waypoint);
            store.commit('waypointUpdate', waypoint);
        }
    });
    return waypoint;
};
