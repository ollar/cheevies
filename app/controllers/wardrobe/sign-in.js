import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import getRootUrl from 'cheevies/utils/get-root-url';

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

            function fetchLocal(url) {
              return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest
                xhr.onload = function() {
                  resolve(new Response(xhr.responseText, {status: xhr.status}))
                }
                xhr.onerror = function() {
                  reject(new TypeError('Local request failed'))
                }
                xhr.open('GET', url)
                xhr.send(null)
              })
            }

            return fetchLocal(`${getRootUrl()}_demo-group.json`).then(res => res.json()).then(res => JSON.parse(res))
                    .then(async ({ imageSets, cheevies, users, you, demoGroup }) => {
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

                    const _demoGroup = {...demoGroup};

                    _demoGroup.name = 'demo-group-' + user.id;

                    const group = this.store.push(
                        this.store.normalize('demo/group', _demoGroup)
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
