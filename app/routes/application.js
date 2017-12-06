import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),
  notificationTypes: ['info', 'success', 'warning', 'danger'],
  session: service(),
  beforeModel(transition) {
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
      alert(e);
    },
    notify(type, text) {
      if (this.get('notificationTypes').indexOf(type) === -1) {
        return this.send('error', text);
      }
      return this.get('notify')[type](text);
    }
  }
});
