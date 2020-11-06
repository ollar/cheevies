import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { get, computed } from '@ember/object';
import { debounce } from '@ember/runloop';
import { readOnly } from '@ember/object/computed';

export default Service.extend({
    myGroup: service('my-group'),
    store: service(),

    isDemo: readOnly('myGroup.isDemo'),

    _typeImage: computed('isDemo', function() {
        return this.isDemo ? 'demo/image' : 'image';
    }),

    _typeImageSet: computed('isDemo', function() {
        return this.isDemo ? 'demo/image-set' : 'image-set';
    }),

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

    saveGiphy(giphy, model) {
        return this.removeImage(model)
            .then(async () => {
                const imageSet = this.store.createRecord(this._typeImageSet);

                const _hash = {
                    64: {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    },
                    128: {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    },
                    256: {
                        url: get(giphy, 'images.downsized_medium.url'),
                        height: get(giphy, 'images.downsized_medium.height'),
                        width: get(giphy, 'images.downsized_medium.width'),
                        created: Date.now(),
                    },
                    512: {
                        url: get(giphy, 'images.downsized_large.url'),
                        height: get(giphy, 'images.downsized_large.height'),
                        width: get(giphy, 'images.downsized_large.width'),
                        created: Date.now(),
                    },
                };

                imageSet.setProperties(_hash);

                await imageSet.save();

                model.set('image-set', imageSet);

                return true;
            });
    },

    removeImage(model, saveModel = false) {
        return model
            .get('image-set')
            .then(imageSet => {
                if (!imageSet) return Promise.resolve();
                model.set('image-set', '');
                const promises = [imageSet.destroyRecord()];

                if (saveModel) promises.push(model.save());

                return Promise.all(promises);
            });
    },
});
