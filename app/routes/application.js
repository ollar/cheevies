import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),
  me: service(),
  firebaseApp: service(),

  init() {
    this._super(...arguments);
    this.notificationTypes = ['info', 'success', 'warning', 'error'];
  },
  ____afterModel() {
    const messaging = this.get('firebaseApp').messaging();
    const _this = this;

    if (this.get('me.model')) {
      messaging
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
        });
      if (this.get('me.model').get('unseenCheevies.length')) {
        this.transitionTo('index.new-cheevies');
      }
    }

    messaging.onMessage(payload => {
      _this.send('notify', {
        type: 'info',
        text: payload.notification.body,
      });
    });
  },
  model() {
    return this.me.fetch();
  },
  actions: {
    notify({ type, text }) {
      if (this.get('notificationTypes').indexOf(type) === -1) {
        throw new Error(text);
      }
      return this.get('notify')[type](text);
    },
  },
});
