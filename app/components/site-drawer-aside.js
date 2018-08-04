import Component from 'site-drawer-component/components/site-drawer-aside';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  me: service(),
  session: service(),
  router: service(),
  avatar: computed.readOnly('me.model.image-set'),
  cheevies: computed.readOnly('me.model.cheevies'),

  actions: {
    createCheevie() {
      this.get('router').transitionTo('index.create-cheevie');
    },
    invalidate() {
      return this.session
        .invalidate()
        .then(() => this.get('router').transitionTo('login'));
    },
  },
});
