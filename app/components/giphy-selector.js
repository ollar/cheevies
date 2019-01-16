import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, computed } from '@ember/object';

export default Component.extend({
    query: '',
    giphy: service(),
    url: observer('query', function() {
        this.giphy._getGiphies(this.query);
    }),

    giphies: computed('giphy.result', function() {
        return this.getWithDefault('giphy.result.data', []);
    }),

    actions: {
        goBack() {
            this.goBack();
        },
    },
});
