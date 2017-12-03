import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
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
    notify(type, message) {
      alert(message);
    },
  }
});
