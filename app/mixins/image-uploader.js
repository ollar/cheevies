import Mixin from '@ember/object/mixin';
import { hash, resolve, all } from 'rsvp';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import imageResize from 'image-resize-util/utils/image-resize';

// const IMAGE_SIZES = [32, 64, 128, 256, 512];
const IMAGE_SIZES = [64, 128, 256, 512];

export default Mixin.create({
    fileStorage: service(),

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
                const m = this.store.createRecord('image', {
                    url: snapshot.downloadURLs[0],
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
        return this._removeImage()
            .then(() =>
                hash(
                    IMAGE_SIZES.reduce((acc, cur) => {
                        acc[cur] = this._processImageUpload(file, cur);
                        return acc;
                    }, {})
                )
            )
            .then(_hash => {
                const imageSet = this.store.createRecord('image-set');
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
                const imageSet = this.store.createRecord('image-set');

                debugger;

                const _hash = {
                    64: this.store.createRecord('image', {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    }),
                    128: this.store.createRecord('image', {
                        url: get(giphy, 'images.preview_gif.url'),
                        height: get(giphy, 'images.preview_gif.height'),
                        width: get(giphy, 'images.preview_gif.width'),
                        created: Date.now(),
                    }),
                    256: this.store.createRecord('image', {
                        url: get(giphy, 'images.downsized_medium.url'),
                        height: get(giphy, 'images.downsized_medium.height'),
                        width: get(giphy, 'images.downsized_medium.width'),
                        created: Date.now(),
                    }),
                    512: this.store.createRecord('image', {
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
                const _imageSet = this.store.peekRecord('image-set', imageSet.id);
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
