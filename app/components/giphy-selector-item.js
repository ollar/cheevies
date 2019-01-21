import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    image: computed('data', function() {
        return {
            sm: { url: this.getWithDefault('data.images.downsized_small.url', '') },
            md: { url: this.getWithDefault('data.images.downsized_medium.url', '') },
            lg: { url: this.getWithDefault('data.images.downsized_medium.url', '') },
        };
    }),

    imageUrl: computed('data', function() {
        return this.getWithDefault('data.images.preview_gif.url', '');
    }),

    actions: {
        takeGiphy() {
            this.takeGiphy(this.data);
        },
    },
});
