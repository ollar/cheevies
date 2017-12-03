import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'header',
  classNames: ['header'],

  session: service(),
  getUser: service(),

  user: computed.readOnly('getUser.user'),

  actions: {
    signOut() {
      this.get('session').close()
        .then(() => {
          return Ember.getOwner(this).get('router').transitionTo('login');
        });
    },
  }
});
