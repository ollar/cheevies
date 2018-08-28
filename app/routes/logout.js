import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Route.extend({
  session: service(),
  beforeModel() {
    return run(() => {
      this.store.unloadAll();

      run(() => {
        this.get('session')
          .invalidate()
          .then(() => this.get('router').transitionTo('login'));
      });
    });
  },
});
