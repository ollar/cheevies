import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  getUser: service(),
  model() {
    return this.get('getUser.user');
  },

  actions: {
    willTransition() {
      const model = this.model();
      model.set('unseenCheevies', []);
      model.save();
      return true;
    }
  }
});
