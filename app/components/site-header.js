import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'header',
  classNames: ['header'],

  session: service(),
  getUser: service(),
  router: service(),

  user: computed.readOnly('getUser.user'),
  avatar: computed.readOnly('user.image-set.64'),

  actions: {
    signOut() {
      this.get('session')
        .close()
        .then(() => this.router.transitionTo('index'));
    },
  },
});
