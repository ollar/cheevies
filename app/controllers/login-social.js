import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default Controller.extend({
    session: service(),

    handleSuccess({ credential, user }) {
        const { providerId, accessToken } = credential;
        const { email, displayName, photoURL, uid } = user;

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
                this.session.authenticate('authenticator:social', { uid });
            })
            .then(() => this.transitionToRoute('login'));
    },
    handleError(error) {
        this.send('notify', {
            type: 'error',
            text: error.message,
        });
    },

    actions: {
        googleSignIn() {
            return this.model
                .googleSignIn()
                .then(result => this.handleSuccess(result))
                .catch(error => this.handleError(error));
        },
        facebookSignIn() {
            return this.model
                .facebookSignIn()
                .then(result => this.handleSuccess(result))
                .catch(error => this.handleError(error));
        },
    },
});
