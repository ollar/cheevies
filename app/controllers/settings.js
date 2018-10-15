import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    firebaseApp: service(),
    me: service(),

    actions: {
        updatePushNotifications(val) {
            const messaging = this.get('firebaseApp').messaging();

            if (this.get('me.model')) {
                const promise = val
                    ? messaging
                          .requestPermission()
                          .then(() => messaging.getToken())
                          .then(token => {
                              this.get('me.model').set('fcmToken', token);
                              this.get('me.model').save();
                          })
                          .catch(err => {
                              this.send('notify', {
                                  type: 'error',
                                  text: err.toString(),
                              });
                          })
                    : messaging.deleteToken(this.me.model.fcmToken).then(() => {
                          this.get('me.model').set('fcmToken', '');
                          this.get('me.model').save();
                      });

                promise.then(() => {
                    this.model.set('pushNotifications', val);
                    this.model.save();
                });
            }
        },

        updateModel(e) {
            const { name, checked } = e.target;

            this.model.set(name, checked);
            this.model.save();
        },
    },
});
