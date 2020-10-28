import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

export default Base.extend({
    session: service(),
    firebase: service('firebase-app'),

    restore(data) {
        return Promise.resolve(data);
    },

    authenticate({ email, password, model }) {
        return this.firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                if (model && model.pendingCred) {
                    res.linkWithCredential(model.pendingCred);
                }
                return {
                    uid: res.uid,
                };
            });
    },

    invalidate() {
        window.localStorage.removeItem('awaitForSignInRedirect');
        this.session.set('data.group', '');
        return this.firebase.auth().signOut();
    },
});
