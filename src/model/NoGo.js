import { uuid } from 'uuidv4';
import { DomEvent, circle } from 'leaflet';

import store from '../store';

export default class NoGo {
    constructor(l, id) {
        this.l = l;

        this.id = id || uuid();
        this.name = name || `POI ${this.id.substring(1, 16)}`;
    }

    get latlng() {
        return this.l.getLatLng();
    }

    get radius() {
        return this.l.getRadius();
    }

    equalsTo(nogo) {
        return this.id == nogo.id || (this.latlng.lat == nogo.latlng.lat && this.latlng.lng == nogo.latlng.lng);
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            latlng: this.latlng,
            radius: this.radius,
            icon: this.icon
        };
    }

    toString() {
        return `id:${this.id}, name:${this.name}, latlng:${this.latlng}, radius:${this.radius}`;
    }
}

export const createNoGo = _nogo => {
    console.log('createNoGo', _nogo);

    let options = {
        ...{ radius: _nogo.radius || 2000 }
    };

    let nogo = new NoGo(circle(_nogo.latlng, options));
    nogo.l.on('click', evt => {
        DomEvent.stop(evt);
        if (store.state.toolBarMode == 'delete') {
            store.commit('nogoRemove', nogo);
        } else {
            nogo.l.toggleEdit();
            if (nogo.l.editEnabled()) {
                nogo.l.setStyle({ color: 'darkred' });
            } else {
                nogo.l.setStyle({ color: '#3388ff' });
                store.commit('nogoUpdate', nogo);
            }
        }
    });
    return nogo;
};
