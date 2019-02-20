import Controller from '@ember/controller';
import firebase from 'firebase';
import { resolve } from 'rsvp';
import { schedule, later } from '@ember/runloop';

export default Controller.extend({
    init() {
        this._super(...arguments);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess() {
        return resolve()
            .then(() =>
                this.send('notify', {
                    type: 'success',
                    text: this.get('intl').t('reset-password.success_message'),
                })
            )
            .then(() =>
                later(() => schedule('routerTransitions', () => this.send('cancel')), 2000)
            );
    },

    onError(e) {
        this.model.rollbackAttributes();
        this.send('notify', {
            type: 'error',
            text: e.message || this.get('intl').t('reset-password.error_message'),
        });
    },

    actions: {
        resetPassword() {
            if (this.model.validate()) {
                var auth = firebase.auth();
                auth.sendPasswordResetEmail(this.model.email).then(this.onSuccess, this.onError);
            }
        },

        cancel() {
            return window.history.back();
        },
    },
});
