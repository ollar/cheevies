import DS from 'ember-data';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default DS.Model.extend(Validator, {
    email: DS.attr('string'),
    password: DS.attr('string'),
    type: DS.attr('string'),

    firebase: service('firebase-app'),
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
                .fetchProvidersForEmail(this.email)
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
            .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .catch(e => this.handleSocialError(e));
    },

    facebookSignIn() {
        this._prepareSignInFlow();
        return this.firebase
            .auth()
            .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
            .catch(e => this.handleSocialError(e));
    },

    anonymousSignIn() {
        return this.firebase.auth().signInAnonymously();
    },
});
