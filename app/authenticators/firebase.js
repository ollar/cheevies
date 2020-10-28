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
            .then(auth => auth.signInWithEmailAndPassword(email, password))
            .then(({ user }) => {
                if (model && model.pendingCred) {
                    user.linkWithCredential(model.pendingCred);
                }
                return {
                    uid: user.uid,
                };
            });
    },

    invalidate() {
        window.localStorage.removeItem('awaitForSignInRedirect');
        this.session.set('data.group', '');
        return this.firebase
            .auth()
            .then(auth => auth.signOut());
    },
});
