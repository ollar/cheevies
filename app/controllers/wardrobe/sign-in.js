import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default class WardrobeSignInController extends Controller {
    @service session;
    @service me;
    @service activity;

    @action
    passwordSignIn(e) {
        if (e && e.preventDefault) e.preventDefault();

        if (this.model.validate()) {
            const data = this.model.serialize();

            this.session.authenticate('authenticator:application', data)
                .then(this.onSuccess, this.onError);
        }
    }

    @action
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
    }

    @action
    onError(err) {
        this.send('notify', {
            type: 'error',
            text: err.detail
        });
    }
}
