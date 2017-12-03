import ToriiFirebaseAdapter from 'emberfire/torii-adapters/firebase';

export default ToriiFirebaseAdapter.extend({
  register(email, password) {
    return this.get('firebaseApp').auth().createUserWithEmailAndPassword(email, password);
  },
});