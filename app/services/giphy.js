import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

export default Service.extend({
    result: null,
    _limit: 25,
    _offset: 0,
    _rating: 'G',
    _lang: 'en',

    _giphyApiKey: computed(function() {
        return getOwner(this).application.giphyApiKey;
    }),

    url(query = '') {
        return `https://api.giphy.com/v1/gifs/search?api_key=${
            this._giphyApiKey
        }&q=${query}&limit=${this._limit}&offset=${this._offset}&rating=${this._rating}&lang=${
            this._lang
        }`;
    },
});
