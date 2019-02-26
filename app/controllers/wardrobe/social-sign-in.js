import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { all, hash } from 'rsvp';
import firebase from 'firebase';
import demoGroup from './_demo-group';

import BusyLoaderMixin from '../../mixins/busy-loader';

export default Controller.extend(BusyLoaderMixin, {
    session: service(),
    activity: service(),

    init() {
        this._super(...arguments);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess(result) {
        if (!result) return;
        const { credential, user } = result;
        if (!credential || !user) return;
        const { providerId, accessToken } = credential;
        const { email, displayName, photoURL, uid } = user;

        window.localStorage.removeItem('awaitForSignInRedirect');

        return this.store
            .findRecord('user', uid)
            .catch(() => {
                let imageSet = null;
                let image = null;
                if (photoURL) {
                    image = this.store.createRecord('image', {
                        url: photoURL,
                    });
                    imageSet = this.store.createRecord('image-set', {
                        '64': image,
                        '128': image,
                        '256': image,
                        '512': image,
                    });
                }
                return all([
                    firebase
                        .database()
                        .ref('/users/' + uid)
                        .set({
                            name: displayName || 'newb',
                            email: email,
                            providerId,
                            'image-set': imageSet ? imageSet.id : '',
                            accessToken,
                            created: Date.now(),
                        }),
                    image ? image.save() : Promise.resolve(),
                    imageSet ? imageSet.save() : Promise.resolve(),
                ]);
            })
            .then(() => {
                this.session.authenticate('authenticator:social', {
                    uid,
                });
            })
            .then(() =>
                this.activity.send({
                    action: 'logged',
                })
            )
            .then(() => {
                const joinGroupModel = this.store.peekAll('join-group').firstObject;
                if (joinGroupModel) {
                    this.transitionToRoute('join-group', joinGroupModel['group_id'], {
                        queryParams: joinGroupModel.queryParams,
                    });
                } else {
                    schedule('routerTransitions', () =>
                        this.transitionToRoute('wardrobe.select-group')
                    );
                }
            });
    },

    onError(error) {
        this.send('notify', {
            type: 'error',
            text: error.message,
        });
    },

    actions: {
        googleSignIn() {
            return this.model
                .googleSignIn()
                .then(() =>
                    firebase
                        .auth()
                        .getRedirectResult()
                        .then(this.onSuccess)
                )
                .catch(this.onError);
        },
        facebookSignIn() {
            return this.model
                .facebookSignIn()
                .then(() =>
                    firebase
                        .auth()
                        .getRedirectResult()
                        .then(this.onSuccess)
                )
                .catch(this.onError);
        },
        demoSignIn() {
            this.setBusy(true);
            return (
                this.model
                    .anonymousSignIn()
                    .then(({ uid }) => {
                        const user = this.store.createRecord('demo/user', {
                            name: 'demoUser',
                            created: Date.now(),
                        });

                        const group = this.store.createRecord('demo/group', {
                            name: 'demo-group-' + Math.round(Math.random() * 1000),
                        });

                        // this.session.authenticate('authenticator:social', {
                        //     uid,
                        // });

                        group.users.pushObject(user);
                        user.groups.pushObject(group);

                        // this.session.set('data.group', group.name);
                        // this.session.set('data.demoGroup', true);
                        this.setBusy(false);

                        return all([user.save(), group.save()]);
                    })
                    // .then(() => schedule('routerTransitions', () => this.transitionToRoute('index')))
                    .catch(this.onError)
            );
        },
    },
});
