import ToriiSession from 'torii/services/torii-session';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default ToriiSession.extend({
  store: service(),


  init() {
    this._super(...arguments);

    this.me = {};

    this.addObserver('isAuthenticated', this, () => {
      if (this.get('isAuthenticated')) {
        this.get('store').query('user', {
          orderBy: 'email',
          equalTo: this.get('currentUser.email'),
        }).then((users) => {
          if (users.get('length') === 1) {
            this.set('me', users.get('firstObject'));
          }
        });
      } else {
        this.set('me', {});
      }
    });
  },

  register() {
    var owner = getOwner(this);
    var adapter = owner.lookup('torii-adapter:application');
    return adapter.register(...arguments);
  },
});
