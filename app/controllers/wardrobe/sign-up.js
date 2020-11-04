import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WardrobeSignUpController extends Controller {
    @service session;
    @service me;
    @service activity;

    @action
    onSuccess() {
        return this.me
            .fetch()
            .then(() => {
                const joinGroupModel = this.store.peekAll('join-group').firstObject;
                if (joinGroupModel)
                    return this.transitionToRoute('join-group', joinGroupModel['group_id'], {
                        queryParams: joinGroupModel.queryParams,
                    });
            })
            .then(() =>
                this.activity.send({
                    action: 'registered',
                })
            )
            .then(() => this.transitionToRoute('wardrobe.select-group'))
    }

    @action
    onError(err) {
        Object.keys(err).forEach(key =>
            this.send({
                type: 'error',
                text: err[key]
            })
        );
    }

    @action
    handleRegister(e) {
        if (e && e.preventDefault) e.preventDefault();

        const data = this.model.serialize();

        if (this.model.validate()) {
            return this.session.register(data)
                .then(() => this.session.authenticate('authenticator:application', data))
                .then(() => {
                    const user = this.store.createRecord('user', {
                        username: data.username,
                        email: data.email,
                    });

                    return user.save();
                })
                .then(this.onSuccess)
                .catch(this.onError);
        }
    }
}
