export default class Segment {
    constructor(id, from, to, latlngs, options, original) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.latlngs = latlngs;

        this.options = options;
        this.duration = parseInt(this.options.properties['total-time']);
        this.distance = parseInt(this.options.properties['track-length']);

        this._calcAscendDescend();
        this._handleOriginal(original);
    }

    _calcAscendDescend() {
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
    }

    _handleOriginal(original) {
        this.original = original;
        original && console.log('original', original);
    }

    toString() {
        return `id:${this.id}, from:${this.from}, to:${this.to}, ascend:${this.ascend}, descend:${this.descend}, duration:${this.duration}, distance:${this.distance} `;
    }
}
