import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default Controller.extend({
    firebaseApp: service(),
    me: service(),
    settings: service(),

    messaging: computed(function() {
        return this.get('firebaseApp').messaging();
    }),

    installStandalone: service('install-standalone'),

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

    actions: {
        updatePushNotifications(val) {
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

        updateModel(e) {
            const { name, checked } = e.target;

            this.model.set(name, checked);
            this._modelSave();
        },

        promptInstallStandalone() {
            this.installStandalone.showPrompt();
        },
    },
});
