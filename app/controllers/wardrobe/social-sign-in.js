import Controller from '@ember/controller';
import {
    inject as service
} from '@ember/service';
import firebase from 'firebase';

export default Controller.extend({
    session: service(),

    init() {
        this._super(...arguments);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess({
        credential,
        user
    }) {
        const {
            providerId,
            accessToken
        } = credential;
        const {
            email,
            displayName,
            photoURL,
            uid
        } = user;

        console.log(credential, user);

        return this.store
            .findRecord('user', uid)
            .catch(() => {
                return firebase
                    .database()
                    .ref('/users/' + uid)
                    .set({
                        name: displayName || 'newb',
                        email: email,
                        providerId,
                        accessToken,
                        photoURL,
                        created: Date.now(),
                    });
            })
            .then(() => {
                this.session.authenticate('authenticator:social', {
                    uid
                });
            })
            .then(() => this.transitionToRoute('wardrobe.select-group'));
    },

    onError(error) {
        this.send('notify', {
            type: 'error',
            text: error.message,
        });
    },

    actions: {
        googleSignIn() {
            return this.model
                .googleSignIn()
                .then(this.onSuccess, this.onError);
        },
        facebookSignIn() {
            return this.model
                .facebookSignIn()
                .then(this.onSuccess, this.onError);
        },
    },
});
