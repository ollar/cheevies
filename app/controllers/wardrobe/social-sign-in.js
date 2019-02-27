import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { all, resolve } from 'rsvp';
import firebase from 'firebase';
import demoGroup, { users, cheevies, images, imageSets, demoGroupId } from './_demo-group';

import BusyLoaderMixin from '../../mixins/busy-loader';

const getRandomInt = () => Math.round(Math.random() * 1000);

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
            return resolve()
                .then(() => {
                    const uid = getRandomInt();
                    Object.keys(images).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/image',
                                Object.assign({}, { id: key }, images[key])
                            )
                        );
                    });

                    Object.keys(imageSets).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/image-set',
                                Object.assign({}, { id: key }, imageSets[key])
                            )
                        );
                    });

                    Object.keys(cheevies).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/cheevie',
                                Object.assign({}, { id: key }, cheevies[key])
                            )
                        );
                    });

                    Object.keys(users).forEach(key => {
                        this.store.push(
                            this.store.normalize(
                                'demo/user',
                                Object.assign({}, { id: key }, users[key])
                            )
                        );
                    });

                    const user = this.store.createRecord('demo/user', {
                        id: uid,
                        name: 'demoUser',
                        created: Date.now(),
                    });

                    this.store.push(
                        this.store.normalize(
                            'demo/group',
                            demoGroup('demo-group-' + getRandomInt())
                        )
                    );

                    const group = this.store.peekRecord('demo/group', demoGroupId);

                    this.session.authenticate('authenticator:test', {
                        uid,
                    });

                    group.users.addObject(user);
                    user.groups.addObject(group);

                    this.session.set('data.group', group.name);
                    this.session.set('data.demoGroup', true);
                    this.setBusy(false);

                    return all([user.save(), group.save()]);
                })
                .then(() => schedule('routerTransitions', () => this.transitionToRoute('index')))
                .catch(this.onError);
        },
    },
});
