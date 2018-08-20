import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  activePage: 'users',

  users: computed('model.users.[]', function() {
    return this.model.users.filter(user => user.id !== this.model.me.id);
  }),

  cheevies: computed.readOnly('model.cheevies'),

  actions: {
    openDrawer() {
      this.send('toggleDrawer');
    },
    setActivePage(type) {
      this.set('activePage', type);
    },
  },
});
