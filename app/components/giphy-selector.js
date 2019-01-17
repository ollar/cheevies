import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, computed } from '@ember/object';

export default Component.extend({
    giphy: service(),
    query: '',

    url: observer('query', function() {
        this.giphy.getGiphies(this.query);
    }),

    giphies: computed('giphy.result', function() {
        return this.getWithDefault('giphy.result.data', []);
    }),

    willDestroyElement() {
        this.set('query', '');
        this.giphy.resetProperties();
    },

    actions: {
        goBack() {
            this.goBack();
        },

        takeGiphy() {
            this.goBack();
            this.takeGiphy(...arguments);
        },
    },
});
