import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

import { tracked } from '@glimmer/tracking';

import demoGroup, {
  users,
  cheevies,
  images,
  imageSets,
  you
} from './_demo-group';

export default class WardrobeSignInController extends Controller {
    @service session;
    @service me;
    @service activity;

    @tracked busy;

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


    @action
    demoSignIn() {
            this.busy = true;
            return Promise.resolve()
                .then(async () => {
                    Object.keys(imageSets).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/image-set',
                                Object.assign({}, { _id: key }, imageSets[key])
                            )
                        );
                    });

                    Object.keys(cheevies).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/cheevie',
                                Object.assign({}, { _id: key }, cheevies[key])
                            )
                        );
                    });

                    Object.keys(users).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/user',
                                Object.assign({}, { _id: key }, users[key])
                            )
                        );
                    });

                    const user = this.store.push(
                        this.store.normalize(
                            'demo/user',
                            Object.assign({}, { _id: 'youruserid' }, you)
                        )
                    );

                    const group = this.store.push(
                        this.store.normalize('demo/group', demoGroup('demo-group-' + user.id))
                    );

                    await this.session.authenticate('authenticator:test', {
                        group: group.name,
                        demoGroup: true
                    });

                    group.users.pushObject(user);
                    group.set('author', user);
                    user.groups.pushObject(group);

                    this.busy = false;

                    return Promise.all([user.save(), group.save()]);
                })
                .then(() => schedule('routerTransitions', () => this.transitionToRoute('index')))
                .catch(err => {
                    this.send('notify', {
                        type: 'error',
                        text: err.message
                    });
                });
        }
}
