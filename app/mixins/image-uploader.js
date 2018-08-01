import Mixin from '@ember/object/mixin';
import { hash, resolve } from 'rsvp';
import { inject as service } from '@ember/service';
import imageResize from 'image-resize-util/utils/image-resize';

const IMAGE_SIZES = [32, 64, 128, 256, 512];

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
            acc[cur] = this._processImageUpload(file, cur);
            return acc;
          }, {})
        )
      )
      .then(_hash => {
        const a = this.store.createRecord('image-set');
        a.setProperties(_hash);
        this.model.set('image-set', a);
        a.save();
        return this.model.save();
      })
      .catch(err =>
        this.send('notify', {
          type: 'error',
          text: err.message,
        })
      );
  },

  _removeImage() {
    return this.model
      .get('image-set')
      .then(imageSet => {
        if (!imageSet) resolve();
        imageSet.eachRelationship(imageKey =>
          imageSet.get(imageKey).then(image => image.destroyRecord())
        );
        return imageSet.destroyRecord();
      })
      .catch(() => true);
  },
});