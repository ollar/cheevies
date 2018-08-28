import Mixin from '@ember/object/mixin';
import { hash, resolve } from 'rsvp';
import { inject as service } from '@ember/service';
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
      .then(image => this.fileStorage.upload(this._uploadPath(image), image))
      .then(snapshot => {
        const m = this.store.createRecord('image', {
          url: snapshot.downloadURLs[0],
          fullPath: snapshot.fullPath,
          type: snapshot.contentType,
          name: snapshot.name,
          size: snapshot.size,
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
            console.log(cur);

            acc[cur] = this._processImageUpload(file, cur);
            return acc;
          }, {})
        )
      )
      .then(_hash => {
        const imageSet = this.store.createRecord('image-set');
        imageSet.setProperties(_hash);
        this._model.set('image-set', imageSet);
        this._model.save();
        imageSet.save();
      })
      .catch(err =>
        this.send('notify', {
          type: 'error',
          text: err.message,
        })
      );
  },

  _removeImage() {
    return this._model
      .get('image-set')
      .then(imageSet => {
        if (!imageSet) return resolve();
        const _imageSet = this.store.peekRecord('image-set', imageSet.id);
        _imageSet.destroyRecord();
        this._model.set('image-set', null);
        return this._model.save();
      })
      .catch(e => {
        throw e;
      });
  },
});
