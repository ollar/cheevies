import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { get, set } from '@ember/object';
import { Promise, resolve } from 'rsvp';
import Evented from '@ember/object/evented';


export default Base.extend(Evented, {
    session: service(),
    firebase: service('firebase-app'),

    // restore(data) {
    //     return Promise.resolve(data);
    // },

    restoring: true,
    persist: resolve,
    clear: resolve,

    restore(data) {
    return new Promise(resolve => {
            this.firebase.auth().then(auth => auth.onIdTokenChanged(user => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken()} : {};
                if (this.restoring) {
                    set(this, 'restoring', false);
                    resolve({ authenticated, ...data });
                } else {
                    this.trigger('sessionDataUpdated', { authenticated, ...data });
                }
            })));
        });
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
