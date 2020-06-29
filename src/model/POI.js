import store from '../store';
import { uuid } from 'uuidv4';

export default class POI {
    constructor(l, id, name) {
        this.l = l;

        this.id = id || uuid();
        this.name = name || `POI ${this.id.substring(1, 16)}`;
    }

    get latlng() {
        return this.l.getLatLng();
    }

    get options() {
        return {
            draggable: this.l.options.draggable
        };
    }

    get icon() {
        return this.l.options.icon.options;
    }

    equalsTo(poi) {
        return this.id == poi.id || (this.latlng.lat == poi.latlng.lat && this.latlng.lng == poi.latlng.lng);
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
        return `id:${this.id}, name:${this.name}, latlng:${this.latlng}`;
    }
}

export const createPOI = _poi => {
    console.log('createPOI', _poi);

    let options = {
        ...{
            // defaults
            draggable: true,
            icon: window.L.AwesomeMarkers.icon({
                ...{
                    // defaults
                    icon: 'map-marked-alt',
                    prefix: 'fa',
                    markerColor: 'purple'
                },
                ..._poi.icon
            })
        },
        ..._poi.options
    };

    let poi = new POI(window.L.marker(_poi.latlng, options));
    poi.l.on('click', evt => {
        window.L.DomEvent.stop(evt);
        if (store.state.toolBarMode == 'delete') {
            store.commit('poiRemove', poi);
        }
    });
    poi.l.on('moveend', () => {
        store.commit('poiUpdate', poi);
    });

    return poi;
};
