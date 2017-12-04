import Controller from '@ember/controller';
import firebase from 'firebase';
// import { computed } from '@ember/object';

export default Controller.extend({
  image: null,
  file: null,
  actions: {
    createCheevie() {
      if (this.get('file')) {
        firebase.storage().ref(`cheevies/${this.get('model.id')}`).put(this.get('file'))
          .then((snapshot) => {
            this.get('model').set('imageUrl', snapshot.downloadURL);
            this.get('model').save();
          })
          .catch(() => false);
      }

      this.get('model').save();
      this.transitionToRoute('index');
    },
    goBack() {
      this.model.deleteRecord();
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
  }
});
