import Base from 'ember-simple-auth/authenticators/base';
import {
    inject as service
} from '@ember/service';

export default Base.extend({
    session: service(),
    firebase: service('firebase-app'),

    restore(data) {
        return Promise.resolve(data);
    },

    authenticate({
        email,
        password,
        model
    }) {
        return this.firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                if (model.pendingCred) {
                    res.link(model.pendingCred);
                }
                return {
                    uid: res.uid
                }
            });
    },

    invalidate() {
        this.get('session').set('data.group', '');
        return this.firebase.auth().signOut();
    },
});
