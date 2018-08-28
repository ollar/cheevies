import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  beforeModel(transition) {
    transition.abort();

    this.store.unloadAll();
    return this.get('session')
      .invalidate()
      .then(() => this.get('router').transitionTo('login'));
  },
});
