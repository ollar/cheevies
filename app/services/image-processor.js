import Service, { inject as service } from '@ember/service';
import imageResize from 'image-resize-util/utils/image-resize';
import { hash } from 'rsvp';

function convertToB64(blob) {
    var reader = new FileReader();

    return new Promise((res) => {
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            return res(reader.result);
        }
    });
}

export default class ImageProcessorService extends Service {
    @service store;
    @service myGroup;

    get isDemo() {
        return this.myGroup.isDemo;
    }

    get _typeImageSet() {
        return this.isDemo ? 'demo/image-set' : 'image-set';
    }

    saveGiphy(giphy, model) {
        return this.removeImage(model)
            .then(async () => {
                const imageSet = this.store.createRecord(this._typeImageSet);

                const _hash = {
                    64: {
                        url: giphy.images.preview_gif.url,
                        height: giphy.images.preview_gif.height,
                        width: giphy.images.preview_gif.width,
                        created: Date.now(),
                    },
                    128: {
                        url: giphy.images.preview_gif.url,
                        height: giphy.images.preview_gif.height,
                        width: giphy.images.preview_gif.width,
                        created: Date.now(),
                    },
                    256: {
                        url: giphy.images.downsized_medium.url,
                        height: giphy.images.downsized_medium.height,
                        width: giphy.images.downsized_medium.width,
                        created: Date.now(),
                    },
                    512: {
                        url: giphy.images.downsized_large.url,
                        height: giphy.images.downsized_large.height,
                        width: giphy.images.downsized_large.width,
                        created: Date.now(),
                    },
                };

                imageSet.setProperties(_hash);

                await imageSet.save();

                model.set('image-set', imageSet);

                return true;
            });
    }

    resizeImage(file, size) {
        return imageResize(file, {
                    maxWidth: size,
                    maxHeight: size,
                }).then(async blob => {
                    const base64 = await convertToB64(blob);
                    return {
                        url: base64,
                        height: blob.height,
                        width: blob.width,
                        created: Date.now(),
                    }
                });
    }

    saveFile(file, model) {
        return this.removeImage(model)
            .then(() => {
                return hash({
                    64: this.resizeImage(file, 64),
                    128: this.resizeImage(file, 128),
                    256: this.resizeImage(file, 256),
                    512: this.resizeImage(file, 512),
                })
            })
            .then(async _hash => {
                const imageSet = this.store.createRecord(this._typeImageSet);

                imageSet.setProperties(_hash);

                await imageSet.save();

                model.set('image-set', imageSet);
                return true;
            });
    }

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
    }
}
