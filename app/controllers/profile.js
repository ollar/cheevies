import Controller from '@ember/controller';
import firebase from 'firebase';
import { computed } from '@ember/object';

export default Controller.extend({
  getUser: Ember.inject.service(),

  cheeviesPickerIsVisible: false,

  userId: computed.readOnly('model.user.id'),
  myId: computed.readOnly('getUser.user.id'),
  me: computed.alias('getUser.user'),

  isMe: computed('userId', 'myId', function() {
    return this.get('userId') === this.get('myId');
  }),

  actions: {
    showCheeviesPicker(value) {
      this.set('cheeviesPickerIsVisible', value);
    },

    uploadImage(file) {
      if (!this.get('isMe')) return;
      firebase.storage().ref(`users/${this.get('myId')}`).put(file)
        .then((snapshot) => {
          this.get('me').set('photoURL', snapshot.downloadURL);
          this.get('me').save();
        })
        .catch(() => false);
    },

    removeImage() {
      if (!this.get('isMe')) return;
      firebase.storage().ref(`users/${this.get('myId')}`).delete();
      this.get('me').set('photoURL', '');
      this.get('me').save();
    },
  }
});
