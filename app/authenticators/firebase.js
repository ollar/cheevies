import Base from 'ember-simple-auth/authenticators/base';
import firebase from 'firebase';
import { inject as service } from '@ember/service';

export default Base.extend({
  session: service(),

  restore(data) {
    return Promise.resolve(data);
  },

  authenticate({ email, password }) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => ({ uid: res.uid }));
  },

  invalidate() {
    this.get('session').set('data.group', '');
    return firebase.auth().signOut();
  },
});
