import { uuid } from 'uuidv4';
import store from '../store/index';
import { createWaypoint } from './Waypoint';
import { polyline } from 'leaflet';
export default class Segment {
    constructor(l, id, name) {
        this.l = l;

        this.id = id || uuid();
        this.name = name || `Segment ${this.id.substring(1, 16)}`;

        this._calcStats();
    }

    get latlng() {
        return this.l.getLatLng();
    }

    get latlngs() {
        return this.l._latlngs;
    }

    get options() {
        return this.l.options;
    }

    get map() {
        return this.l._map;
    }

    serialize() {
        throw new Error('segments are not serializable at the moment');
    }

    _calcStats() {
        this.ascend = 0;
        this.descend = 0;

        let lastAlt;
        this.latlngs.forEach(latlng => {
            let alt = latlng.alt;
            if (lastAlt) {
                let diff = alt - lastAlt;
                if (diff > 0) this.ascend += diff;
                else this.descend -= diff;
            }
            lastAlt = alt;
        });

        this.ascend = parseInt(this.ascend);
        this.descend = parseInt(this.descend);
        this.duration = parseInt(this.options.properties['total-time']);
        this.distance = parseInt((this.options.properties['track-length'] / 1000).toFixed(2));
    }

    toString() {
        return `id:${this.id}, from:${this.from}, to:${this.to}, ascend:${this.ascend}, descend:${this.descend}, duration:${this.duration}, distance:${this.distance} `;
    }
}

export const createSegment = _segment => {
    console.log('createSegment', _segment);

    let segment = new Segment(_segment);
    let dragLine;
    let dragging = false;

    segment.l.on('mouseover', e => {
        segment.map._mouseMarker.setLatLng(e.latlng);
        segment.map._mouseMarker.setOpacity(1.0);

        const nodeStart = store.state.track._getNode(segment.l._startMarkerId);
        const nodeEnd = store.state.track._getNode(segment.l._endMarkerId);

        segment.map._mouseMarker.on(
            'dragstart',
            e => {
                if (dragging) return;
                dragging = true;

                dragLine = polyline([nodeStart.getLatLng(), e.target.getLatLng(), nodeEnd.getLatLng()], {
                    dashArray: '4'
                }).addTo(segment.map);

                segment.l.setStyle({ color: 'grey', opacity: 0.2 });
            },
            this
        );
        segment.map._mouseMarker.on(
            'drag',
            e => {
                dragLine.setLatLngs([nodeStart.getLatLng(), e.target.getLatLng(), nodeEnd.getLatLng()]);
            },
            this
        );
        segment.map._mouseMarker.on(
            'dragend',
            e => {
                dragging = false;
                const waypoint = createWaypoint({ latlng: { lat: e.target._latlng.lat, lng: e.target._latlng.lng } });
                store.state.track.insertNode(waypoint.l, segment.l);
            },
            this
        );
        segment.map._mouseMarker.on(
            'mouseout',
            e => {
                if (dragging) return;
                console.log('mouseMarker.mouseout');

                if (dragLine) {
                    dragLine.remove();
                    setTimeout(() => {
                        dragLine = undefined;
                    }, 100);
                }
                e.target.setOpacity(0.0);
                e.target.off('dragstart');
                e.target.off('drag');
                e.target.off('dragend');
            },
            this
        );
    });

    // segment.l.on('mouseout', () => {
    //     // segment.l.setStyle({ color: '#38AADD', weight: 3 });
    //     // segment.map._mouseMarker.setOpacity(0.0);
    // });

    return segment;
};
