import Base from 'ember-simple-auth/authenticators/base';
import firebase from 'firebase';

export default Base.extend({
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
    return firebase.auth().signOut();
  },
});
