import Controller from '@ember/controller';
import { resolve } from 'rsvp';
import { inject as service } from '@ember/service';
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
                    text: this.intl.t('reset-password.success_message'),
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
            text: e.message || this.intl.t('reset-password.error_message'),
        });
    },

    actions: {
        resetPassword() {
            if (this.model.validate()) {
                return this.firebase.auth()
                    .then(auth => auth.sendPasswordResetEmail(this.model.email))
                    .then(this.onSuccess, this.onError);
            }
        },

        cancel() {
            return window.history.back();
        },
    },
});
