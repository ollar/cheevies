import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { all, resolve } from 'rsvp';
import demoGroup, {
  users,
  cheevies,
  images,
  imageSets,
  you
} from './_demo-group';

import BusyLoaderMixin from '../../mixins/busy-loader';

export default Controller.extend(BusyLoaderMixin, {
    session: service(),
    activity: service(),
    firebase: service('firebase-app'),

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
                    this.firebase
                        .database()
                        .then(database => database.ref('/users/' + uid))
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
                    this.firebase
                        .auth()
                        .then(auth => auth.getRedirectResult())
                        .then(this.onSuccess)
                )
                .catch(this.onError);
        },
        facebookSignIn() {
            return this.model
                .facebookSignIn()
                .then(() =>
                    this.firebase
                        .auth()
                        .then(auth => auth.getRedirectResult())
                        .then(this.onSuccess)
                )
                .catch(this.onError);
        },
        demoSignIn() {
            this.setBusy(true);
            return resolve()
                .then(() => {
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

                    // const user = this.store.createRecord('demo/user', {
                    //     name: "Arnold d'Artagnan (You)",
                    //     created: Date.now(),
                    // });

                    const user = this.store.push(
                        this.store.normalize(
                            'demo/user',
                            Object.assign({}, { id: 'youruserid' }, you)
                        )
                    );

                    const group = this.store.push(
                        this.store.normalize('demo/group', demoGroup('demo-group-' + user.id))
                    );

                    this.session.authenticate('authenticator:test', {
                        uid: user.id,
                    });

                    group.users.pushObject(user);
                    group.set('author', user);
                    user.groups.pushObject(group);

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
