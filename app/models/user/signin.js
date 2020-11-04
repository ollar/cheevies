import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Model.extend(Validator, {
    email: attr('string'),
    password: attr('string'),
    type: attr('string'),

    router: service(),
    intl: service(),

    validations: computed(() => ({
        email: {
            presence: true,
            email: true,
        },
        password: {
            presence: true,
            length: {
                minimum: 6,
            },
        },
    })),

    handleSocialError(error) {
        if (error.code === 'auth/account-exists-with-different-credential') {
            // User's email already exists.
            // The pending Google credential.
            this.set('pendingCred', error.credential);
            // The provider account's email address.
            this.set('email', error.email);
            // Get sign-in methods for this email.
            return firebase
                .auth()
                .then(auth => auth.fetchProvidersForEmail(this.email))
                .then(methods => {
                    // If the user has several sign-in methods,
                    // the first method in the list will be the "recommended" method to use.
                    switch (methods[0]) {
                        case 'password':
                            this.router.transitionTo('wardrobe.sign-in');
                            return Promise.reject({
                                message: this.intl.t('messages.email-auth-required'),
                            });

                        case 'facebook.com':
                            return this.facebookSignIn().then(({ user }) =>
                                user.linkAndRetrieveDataWithCredential(this.pendingCred)
                            );

                        case 'google.com':
                            return this.googleSignIn().then(({ user }) =>
                                user.linkAndRetrieveDataWithCredential(this.pendingCred)
                            );

                        default:
                            throw error;
                    }
                });
        }

        throw error;
    },

    _prepareSignInFlow() {
        window.localStorage.setItem('awaitForSignInRedirect', true);
    },

    googleSignIn() {
        this._prepareSignInFlow();
        return this.firebase
            .auth()
            .then(auth => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()))
            .catch(e => this.handleSocialError(e));
    },

    facebookSignIn() {
        this._prepareSignInFlow();
        return this.firebase
            .auth()
            .then(auth => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider()))
            .catch(e => this.handleSocialError(e));
    },

    anonymousSignIn() {
        return this.firebase
            .auth()
            .then(auth => auth.signInAnonymously());
    },
});
