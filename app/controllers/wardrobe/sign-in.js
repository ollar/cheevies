import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    session: service(),
    me: service(),

    init() {
        this._super(...arguments);
        this.onError = this.onError.bind(this);
        this.passwordSignInSuccess = this.passwordSignInSuccess.bind(this);
    },

    passwordSignInSuccess() {
        return this.me
            .fetch()
            .then(() => {
                const joinGroupModel = this.store.peekAll('join-group').firstObject;
                if (joinGroupModel)
                    this.transitionToRoute('join-group', joinGroupModel['group_id'], {
                        queryParams: joinGroupModel.queryParams,
                    });
            })
            .then(() => {
                this.transitionToRoute('wardrobe.select-group');
            });
    },

    onError(err) {
        this.send('notify', {
            type: 'error',
            text: err.message,
        });
    },

    actions: {
        passwordSignIn() {
            if (this.model.validate({ except: ['group'] })) {
                return this.get('session')
                    .authenticate('authenticator:firebase', {
                        email: this.get('model.email'),
                        password: this.get('model.password'),
                    })
                    .then(this.passwordSignInSuccess, this.onError);
            }
        },
    },
});
