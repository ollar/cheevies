import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { debounce } from '@ember/runloop';

export default Service.extend({
    init() {
        this._super(...arguments);
        this.resetProperties();
    },

    _giphyApiKey: computed(function() {
        return getOwner(this).application.giphyApiKey;
    }),

    _url(query = '') {
        return `https://api.giphy.com/v1/gifs/search?api_key=${
            this._giphyApiKey
        }&q=${query}&limit=${this._limit}&offset=${this._offset}&rating=${this._rating}&lang=${
            this._lang
        }`;
    },

    _makeRequest(query) {
        return fetch(this._url(query))
            .then(res => res.json())
            .then(result => this.set('result', result));
    },

    getGiphies(query) {
        return debounce(this, '_makeRequest', query, 1000);
    },

    resetProperties() {
        this.setProperties({
            _limit: 25,
            _offset: 0,
            _rating: 'G',
            _lang: 'en',
            result: null,
        });
    },
});
