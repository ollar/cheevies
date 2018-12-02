import Controller from '@ember/controller';
import {
    inject as service
} from '@ember/service';
import {
    computed
} from '@ember/object';
import {
    schedule,
    later
} from '@ember/runloop';

export default Controller.extend({
    session: service(),
    me: service(),
    myModel: computed.alias('me.model'),
    activity: service(),

    init() {
        this._super(...arguments);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess() {
        return this.me
            .fetch()
            .then(() => {
                this.myModel.set('name', this.model.name);
                return this.myModel.save();
            })
            .then(() => {
                const joinGroupModel = this.store.peekAll('join-group').firstObject;
                if (joinGroupModel)
                    return this.transitionToRoute('join-group', joinGroupModel['group_id'], {
                        queryParams: joinGroupModel.queryParams,
                    });
            })
            .then(() =>
                later(
                    () =>
                    this.activity.send({
                        action: 'registered',
                    }),
                    2000
                )
            )
            .then(() => schedule('routerTransitions', () =>
                this.transitionToRoute('wardrobe.select-group')
            ))
    },

    onError(err) {
        return this.send('notify', {
            type: 'error',
            text: err.message,
        });
    },

    actions: {
        handleRegister() {
            if (this.model.validate()) {
                this.model
                    .signUp()
                    .then(() =>
                        this.session.authenticate('authenticator:firebase', {
                            email: this.get('model.email'),
                            password: this.get('model.password'),
                        })
                    )
                    .then(this.onSuccess, this.onError);
            }
        },
    }
});
