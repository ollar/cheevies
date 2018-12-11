import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { all } from 'rsvp';
import firebase from 'firebase';

export default Controller.extend({
    session: service(),
    activity: service(),

    init() {
        this._super(...arguments);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess({ credential, user }) {
        if (!credential || !user) return;
        const { providerId, accessToken } = credential;
        const { email, displayName, photoURL, uid } = user;

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
            return this.model.googleSignIn().then(this.onSuccess, this.onError);
        },
        facebookSignIn() {
            return this.model.facebookSignIn().then(this.onSuccess, this.onError);
        },
    },
});
