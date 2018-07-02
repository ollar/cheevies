import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { hash, resolve } from 'rsvp';
import imageResize from '../../utils/image-resize';
import { inject as service } from '@ember/service';


const IMAGE_SIZES = [32, 64, 128, 256, 512];

export default Controller.extend({
  file: null,
  showMode: true,
  fileStorage: service(),

  image: computed.readOnly('model.image-set.256'),

  restoreMode() {
    this.set('file', null);
    this.set('image', null);
    this.set('showMode', true);
  },

  _processImageUpload(file, size) {
    return imageResize(file, {
      maxWidth: size,
      maxHeight: size,
    })
      .then(image =>
        this.fileStorage.upload(
          `cheevies/${this.model.id}/${image.width}/${image.name}`,
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
    toggleMode() {
      this.model.rollbackAttributes();
      this.toggleProperty('showMode');
    },
    goBack() {
      this.model.rollbackAttributes();
      this.restoreMode();
      this.transitionToRoute('index');
    },
    // uploadImage(_file) {
    //   imageResize(_file).then((file) => {
    //     this.set('model.imageUrl', URL.createObjectURL(file));
    //     this.set('file', file);
    //   });
    // },
    uploadImage(files) {
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
        // .catch(err =>
        //   this.send('notify', {
        //     type: 'error',
        //     text: err.message,
        //   })
        // );
    },
    removeImage() {
      return this.removeImage();
    },
    updateCheevie() {
      console.log('ok');

      // if (this.get('file')) {
      //   firebase.storage().ref(`cheevies/${this.get('model.id')}`).put(this.get('file'))
      //     .then((snapshot) => {
      //       this.set('model.imageUrl', snapshot.downloadURL);
      //       this.get('model').save();
      //     })
      //     .catch(() => false);
      // }

      // this.get('model').save();

      // this.restoreMode();

      // this.send('goBack');
    },
    deleteCheevie() {
      if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
        this.get('model').destroyRecord();
        this.transitionToRoute('index');
      }
    }
  }
});
