import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  me: service(),
  session: service(),
  myGroup: computed.readOnly('session.data.group'),

  model() {
    if (!this.myGroup) return {};

    return this.store
      .query('group', {
        orderBy: 'name',
        equalTo: this.myGroup,
      })
      .then(group =>
        hash({
          me: this.me.fetch(),
          users: group.get('firstObject.users'),
          cheevies: group.get('firstObject.cheevies'),
        })
      );
  },
});
