import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),
  notificationTypes: ['info', 'success', 'warning', 'error'],
  session: service(),
  getUser: service(),
  firebaseApp: service(),
  beforeModel(transition) {
    const messaging = this.get('firebaseApp').messaging();
    const _this = this;

    this.get('session').addObserver('me', this, () => {
      const me = this.get('session.me');

      if (Object.keys(me).length) {
        messaging.requestPermission()
          .then(() => messaging.getToken())
          .then((token) => {
            this.get('getUser.user').set('fcmToken', token);
            this.get('getUser.user').save();
          })
          .catch((err) => {
            this.send('notify', 'error', err.toString());
          });
      }
    });

    messaging.onMessage((payload) => {
      _this.send('notify', 'info', payload.toString());
      console.log("Message received. ", payload);
    });

    return this.get('session').fetch()
      .catch(() => {
        if (['login', 'register'].indexOf(transition.targetName) > -1) {
          return;
        }
        return this.transitionTo('login');
      });
  },
  actions: {
    signOut: function() {
      this.get('session').close();
    },
    error(e) {
      console.error(e);
    },
    notify(type, text) {
      if (this.get('notificationTypes').indexOf(type) === -1) {
        return this.send('error', text);
      }
      return this.get('notify')[type](text);
    }
  }
});
