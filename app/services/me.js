import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  session: service(),
  store: service(),

  isAuthenticated: computed.readOnly('session.isAuthenticated'),

  uid: computed('isAuthenticated', function() {
    return this.isAuthenticated
      ? this.getWithDefault('session.data.authenticated.uid', '')
      : '';
  }),

  fetch() {
    return new Promise(res => {
      if (!this.uid) {
        this.set('model', null);
        return res(null);
      }

      if (this.model) {
        return res(this.model);
      }

      this.get('store')
        .findRecord('user', this.uid)
        .then(user => {
          this.set('model', user);
          return user;
        })
        .then(user => res(user));
    });
  },

  model: null,
});
