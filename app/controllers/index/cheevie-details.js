import Controller from '@ember/controller';
import { computed } from '@ember/object';
import firebase from 'firebase';

export default Controller.extend({
  file: null,
  showMode: true,
  image: computed('model.imageUrl', function() {
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
    uploadImage(file) {
      const image = {
        url: URL.createObjectURL(file),
      };

      this.set('image', image);
      this.set('file', file);
    },
    removeImage() {
      this.set('image', null);
    },
    updateCheevie() {
      if (this.get('image.url') !== this.get('model.imageUrl') && this.get('file')) {
        firebase.storage().ref(`cheevies/${this.get('model.id')}`).put(this.get('file'))
          .then((snapshot) => {
            this.get('model').set('imageUrl', snapshot.downloadURL);
            this.get('model').save();
          })
          .catch(() => false);
      }

      this.get('model').save();

      this.restoreMode();

      this.send('goBack');
    }
  }
});
