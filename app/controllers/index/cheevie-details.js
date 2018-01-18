import Controller from '@ember/controller';
import { computed } from '@ember/object';
import firebase from 'firebase';
import imageResize from '../../utils/image-resize';

export default Controller.extend({
  file: null,
  showMode: true,
  image: computed('model.imageUrl', function() {
    if (!this.get('model.imageUrl')) return;
    return {
      url: this.get('model.imageUrl'),
    }
  }),

  restoreMode() {
    this.set('file', null);
    this.set('image', null);
    this.set('showMode', true);
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
    uploadImage(_file) {
      imageResize(_file).then((file) => {
        this.set('model.imageUrl', URL.createObjectURL(file));
        this.set('file', file);
      });
    },
    removeImage() {
      this.set('image', null);
      this.set('model.imageUrl', null);
    },
    updateCheevie() {
      if (this.get('file')) {
        firebase.storage().ref(`cheevies/${this.get('model.id')}`).put(this.get('file'))
          .then((snapshot) => {
            this.set('model.imageUrl', snapshot.downloadURL);
            this.get('model').save();
          })
          .catch(() => false);
      }

      this.get('model').save();

      this.restoreMode();

      this.send('goBack');
    },
    deleteCheevie() {
      if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
        this.get('model').destroyRecord();
        this.transitionToRoute('index');
      }
    }
  }
});
