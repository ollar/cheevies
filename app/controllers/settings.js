import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import { getOwner } from '@ember/application';
import { schedule } from '@ember/runloop';
import { userIsModerator } from '../utils/user-role';

export default Controller.extend({
    firebaseApp: service(),
    me: service(),
    myGroup: service(),
    settings: service(),
    share: service(),
    i18n: service(),

    groupModel: computed.alias('myGroup.model'),

    messaging: computed(function() {
        return this.get('firebaseApp').messaging();
    }),

    installStandalone: service('install-standalone'),
    version: computed(function() {
        return getOwner(this).application.version;
    }),

    _modelSave() {
        return this.settings.save();
    },

    _removeFCMToken() {
        const promise = this.me.model.fcmToken
            ? this.messaging.deleteToken(this.me.model.fcmToken)
            : resolve();

        return promise.then(() => {
            this.get('me.model').set('fcmToken', '');
            return this.get('me.model').save();
        });
    },

    userIsModerator: computed('me.model.id', 'groupModel.moderators', function() {
        return (
            this.groupModel.policy === 'anarchy' || userIsModerator(this.groupModel, this.me.model)
        );
    }),

    actions: {
        updatePushNotifications(e) {
            const val = e.target.checked;
            e.preventDefault();
            e.stopPropagation();

            if (this.get('me.model')) {
                const promise = val
                    ? this.messaging
                          .requestPermission()
                          .then(() => this.messaging.getToken())
                          .then(token => {
                              this.get('me.model').set('fcmToken', token);
                              this.get('me.model').save();
                          })
                          .catch(err => {
                              this._removeFCMToken().then(() =>
                                  this.send('notify', {
                                      type: 'error',
                                      text: err.toString(),
                                  })
                              );
                          })
                    : this._removeFCMToken();

                promise.then(() => {
                    this.model.set('pushNotifications', val);
                    this._modelSave();
                });

                this.messaging.onMessage(payload => {
                    this.send('notify', {
                        type: 'info',
                        text: payload.notification.body,
                    });
                });
            }
        },

        updateModel() {
            this._modelSave();
        },

        updateGroup() {
            if (this.groupModel.validate()) {
                this.groupModel.save();
            }
        },

        promptInstallStandalone() {
            this.installStandalone.showPrompt();
        },

        inviteGroup() {
            return this.share
                .post({
                    title: this.i18n.t('settings.group.invitation.title'),
                    text: this.i18n.t('settings.group.invitation.text', {
                        sender: this.me.model.name,
                        group: this.groupModel.name,
                    }),
                    url: `${window.location.origin}/join/${this.groupModel.id}?code=${
                        this.groupModel.code
                    }`,
                })
                .then(
                    () =>
                        this.send('notify', {
                            type: 'success',
                            text: this.i18n.t('settings.group.invitation.success'),
                        }),
                    () =>
                        this.send('notify', {
                            type: 'error',
                            text: this.i18n.t('settings.group.invitation.error'),
                        })
                );
        },

        reloadApp() {
            schedule('afterRender', () => {
                window.caches
                    .keys()
                    .then(keys => keys.forEach(key => caches.delete(key)))
                    .finally(() => {
                        this.transitionToRoute('index');
                        schedule('routerTransitions', () => {
                            window.location.reload();
                        });
                    });
            });
        },
    },
});
