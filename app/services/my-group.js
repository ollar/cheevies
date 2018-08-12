import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { Promise } from 'rsvp';

export default Service.extend({
  session: service(),
  store: service(),

  isAuthenticated: computed.readOnly('session.isAuthenticated'),
  model: null,

  groupName: computed('isAuthenticated', function() {
    return this.isAuthenticated
      ? this.getWithDefault('session.data.group', '')
      : '';
  }),

  fetch() {
    return new Promise(res => {
      if (!this.groupName) {
        this.set('model', null);
        return res(null);
      }

      if (this.model) {
        return res(this.model);
      }

      return this.get('store')
        .query('group', {
          orderBy: 'name',
          equalTo: this.groupName,
        })
        .then(_group => {
          const group = _group.firstObject;
          this.set('model', group);
          return res(group);
        });
    });
  },
});
