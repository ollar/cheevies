import Controller from '@ember/controller';
import {
    inject as service
} from '@ember/service';
import {
    schedule
} from '@ember/runloop';

export default Controller.extend({
    session: service(),
    me: service(),
    activity: service(),

    init() {
        this._super(...arguments);
        this.onError = this.onError.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
    },

    onSuccess() {
        return this.me
            .fetch()
            .then(() => {
                const joinGroupModel = this.store.peekAll('join-group').firstObject;
                if (joinGroupModel)
                    this.transitionToRoute('join-group', joinGroupModel['group_id'], {
                        queryParams: joinGroupModel.queryParams,
                    });
            })
            .then(() =>
                this.activity.send({
                    action: 'logged',
                })
            )
            .then(() => schedule('routerTransitions', () =>
                this.transitionToRoute('wardrobe.select-group')
            ));
    },

    onError(err) {
        this.send('notify', {
            type: 'error',
            text: err.message,
        });
    },

    actions: {
        passwordSignIn() {
            if (this.model.validate()) {
                return this.get('session')
                    .authenticate('authenticator:firebase', {
                        email: this.get('model.email'),
                        password: this.get('model.password'),
                        model: this.model,
                    })
                    .then(this.onSuccess, this.onError);
            }
        },
    },
});
