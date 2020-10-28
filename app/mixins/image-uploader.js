import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { hash, resolve, all } from 'rsvp';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import imageResize from 'image-resize-util/utils/image-resize';
import Middleware from '../utils/middleware';

const IMAGE_SIZES = [64, 128, 256, 512];

export default Mixin.create({
    fileStorage: service(),
    myGroup: service('my-group'),
    isDemo: readOnly('myGroup.isDemo'),

    _typeImage: computed('isDemo', function() {
        return this.isDemo ? 'demo/image' : 'image';
    }),

    _typeImageSet: computed('isDemo', function() {
        return this.isDemo ? 'demo/image-set' : 'image-set';
    }),

    _processImageUpload(file, size) {
        return imageResize(file, {
            maxWidth: size,
            maxHeight: size,
        })
            .then(image =>
                hash({
                    image,
                    snapshot: this.fileStorage.upload(this._uploadPath(image), image),
                })
            )
            .then(({ image, snapshot }) => {
                const downloadURL = snapshot.ref.getDownloadURL();
                return hash({
                    image, snapshot, downloadURL
                })
            })
            .then(({ image, snapshot, downloadURL }) => {
                const m = this.store.createRecord(this._typeImage, {
                    url: downloadURL,
                    fullPath: snapshot.fullPath,
                    type: snapshot.contentType,
                    name: snapshot.name,
                    size: snapshot.size,
                    height: image.height,
                    width: image.width,
                    created: new Date(snapshot.timeCreated).valueOf(),
                });

                return m.save();
            });
    },

    _uploadImage(file) {
        if (this.isDemo)
            return resolve().then(() =>
                this.send('notify', {
                    type: 'error',
                    text: this.intl.t('messages.demo-restrictions'),
                })
            );
        return this._removeImage()
            .then(
                () => {
                    var middleware = new Middleware();
                    var _hash = {};

                    const upl = (size, next) => {
                        this._processImageUpload(file, size).then(imageModel => {
                            _hash[size] = imageModel;
                            next();
                        });
                    };

                    return new Promise(res => {
                        IMAGE_SIZES.forEach(size => middleware.use(next => upl(size, next)));
                        middleware.go(() => res(_hash));
                    });
                }
                // hash(
                //     IMAGE_SIZES.reduce((acc, cur) => {
                //         acc[cur] = this._processImageUpload(file, cur);
                //         return acc;
                //     }, {})
                // )
            )
            .then(_hash => {
                const imageSet = this.store.createRecord(this._typeImageSet);
                imageSet.setProperties(_hash);
                this._model.set('image-set', imageSet);
                return all([imageSet.save(), this._model.save()]);
            })
            .catch(err =>
                this.send('notify', {
                    type: 'error',
                    text: err.message,
                })
            );
    },

    _saveGiphy(giphy) {
        return this._removeImage()
            .then(() => {
                const imageSet = this.store.createRecord(this._typeImageSet);

                const _hash = {
                    64: this.store.createRecord(this._typeImage, {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    }),
                    128: this.store.createRecord(this._typeImage, {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    }),
                    256: this.store.createRecord(this._typeImage, {
                        url: get(giphy, 'images.downsized_medium.url'),
                        height: get(giphy, 'images.downsized_medium.height'),
                        width: get(giphy, 'images.downsized_medium.width'),
                        created: Date.now(),
                    }),
                    512: this.store.createRecord(this._typeImage, {
                        url: get(giphy, 'images.downsized_large.url'),
                        height: get(giphy, 'images.downsized_large.height'),
                        width: get(giphy, 'images.downsized_large.width'),
                        created: Date.now(),
                    }),
                };

                const _images = Object.values(_hash).map(_image => _image.save());

                imageSet.setProperties(_hash);
                this._model.set('image-set', imageSet);
                return all([..._images, imageSet.save(), this._model.save()]);
            })
            .catch(err =>
                this.send('notify', {
                    type: 'error',
                    text: err.message,
                })
            );
    },

    _removeImage(saveModel = false) {
        return this._model
            .get('image-set')
            .then(imageSet => {
                if (!imageSet) return resolve();
                const _imageSet = this.store.peekRecord(this._typeImageSet, imageSet.id);
                const promises = [_imageSet.destroyRecord()];
                this._model.set('image-set', '');

                if (saveModel) promises.push(this._model.save());

                return all(promises);
            })
            .catch(e => {
                throw e;
            });
    },
});
