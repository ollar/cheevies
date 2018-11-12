import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    cachedImage: service(),
    tagName: '',

    cachedSrc: computed('_src', function() {
        return this.cachedImage.getCachedSrc(this._src);
    }),
});
