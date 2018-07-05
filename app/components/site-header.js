import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'header',
  classNames: ['header'],

  session: service(),
  me: service(),
  router: service(),

  user: computed.readOnly('me.model'),
  avatar: computed.readOnly('user.image-set.64'),

  actions: {
    signOut() {
      this.get('session')
        .invalidate()
        .then(() => this.get('router').transitionTo('login'));
    },
  },
});
