import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),
  session: service(),
  getUser: service(),
  firebaseApp: service(),
  init() {
    this._super(...arguments);
    this.notificationTypes = ['info', 'success', 'warning', 'error'];
  },
  beforeModel(transition) {
    const messaging = this.get('firebaseApp').messaging();
    const _this = this;

    this.get('session').addObserver('me', this, () => {
      const me = this.get('session.me');

      if (Object.keys(me).length) {
        messaging
          .requestPermission()
          .then(() => messaging.getToken())
          .then(token => {
            this.get('getUser.user').set('fcmToken', token);
            this.get('getUser.user').save();
          })
          .catch(err => {
            this.send('notify', 'error', err.toString());
          });
        if (me.get('unseenCheevies.length')) {
          this.transitionTo('index.new-cheevies');
        }
      }
    });

    messaging.onMessage(payload => {
      _this.send('notify', 'info', payload.notification.body);
    });

    return this.get('session')
      .fetch()
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
    notify(type, text) {
      if (this.get('notificationTypes').indexOf(type) === -1) {
        return this.send('error', text);
      }
      return this.get('notify')[type](text);
    },
  },
});
