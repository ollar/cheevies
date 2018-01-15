import Controller from '@ember/controller';
import firebase from 'firebase';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  getUser: service(),

  cheeviesPickerIsVisible: false,

  userId: computed.readOnly('model.id'),
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
          this.get('me').set('imageUrl', snapshot.downloadURL);
          this.get('me').save();
        })
        .catch(() => false);
    },

    removeImage() {
      if (!this.get('isMe')) return;
      firebase.storage().ref(`users/${this.get('myId')}`).delete();
      this.get('me').set('imageUrl', '');
      this.get('me').save();
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
  }
});
