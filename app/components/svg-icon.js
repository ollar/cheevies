import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
    // tagName: '',
    classNames: ['Svg-icon'],
    style: computed('_size', function() {
        if (!this._size) return '';
        return htmlSafe(`height: ${this._size}px; width: ${this._size}px`);
    }),
});
