import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    user: computed.alias('_data.user'),
    userImageSet: computed.alias('user.image-set'),
    userImage: computed('userImageSet.{}', function() {
        if (!this.get('userImageSet.64')) return null;
        return {
            sm: this.get('userImageSet.64'),
            md: this.get('userImageSet.128'),
        };
    }),

    cheevie: computed.alias('_data.cheevie'),
    cheevieImageSet: computed.alias('cheevie.image-set'),
    cheevieImage: computed('cheevieImageSet.{}', function() {
        if (!this.get('cheevieImageSet.64')) return null;
        return {
            sm: this.get('cheevieImageSet.64'),
            md: this.get('cheevieImageSet.128'),
        };
    }),

    _normalizeNumber(_n) {
        return ('0' + _n).slice(-2);
    },

    date: computed('_data.created', function() {
        const d = new Date(this._data.created);
        return `${this._normalizeNumber(
            d.getUTCDate()
        )}.${this._normalizeNumber(d.getUTCMonth() + 1)} - ${this._normalizeNumber(d.getHours())}:${this._normalizeNumber(d.getMinutes())}`;
    }),
});
