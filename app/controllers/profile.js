import Controller from '@ember/controller';
import firebase from 'firebase';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import imageResize from '../utils/image-resize';
import { hash, resolve } from 'rsvp';

const IMAGE_SIZES = [32, 64, 128, 256, 512];

export default Controller.extend({
  getUser: service(),
  fileStorage: service(),

  cheeviesPickerIsVisible: false,

  userId: computed.readOnly('model.id'),
  myId: computed.readOnly('getUser.user.id'),
  me: computed.alias('getUser.user'),

  isMe: computed('userId', 'myId', function() {
    return this.get('userId') === this.get('myId');
  }),

  avatar: computed.readOnly('model.image-set.256'),

  _processImageUpload(file, size) {
    return imageResize(file, {
      maxWidth: size,
      maxHeight: size,
    })
      .then(image =>
        this.fileStorage.upload(
          `users/${this.model.id}/${image.width}/${image.name}`,
          image
        )
      )
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

  removeImage() {
    if (!this.get('isMe')) return resolve();

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

  actions: {
    showCheeviesPicker(value) {
      this.set('cheeviesPickerIsVisible', value);
    },

    uploadImage(files) {
      // if (!this.get('isMe')) return;
      const file = files[0];

      if (!file || file.type.indexOf('image') < 0) return;

      this.removeImage()
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

    pickCheevie(cheevie) {
      this.model.get('cheevies').pushObject(cheevie);
      this.model.get('unseenCheevies').pushObject(cheevie);
      this.model.save();
      this.send('showCheeviesPicker', false);
    },

    refuseCheevie(cheevie) {
      this.model.get('cheevies').removeObject(cheevie);
      this.model.save();
    },
  },
});
