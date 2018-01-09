import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),
  notificationTypes: ['info', 'success', 'warning', 'danger'],
  session: service(),
  firebaseApp: service(),
  beforeModel(transition) {

    const messaging = this.get('firebaseApp').messaging();

    messaging.requestPermission()
      .then(function() {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
      })
      .catch(function(err) {
        console.log('Unable to get permission to notify.', err);
      });

    messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      // ...
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
