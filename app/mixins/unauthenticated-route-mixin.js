import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Mixin from '@ember/object/mixin';

import { assert } from '@ember/debug';

export default Mixin.create(UnauthenticatedRouteMixin, {
  beforeModel() {
    if (
      this.get('session').get('isAuthenticated') &&
      this.get('session.data.authenticated.group')
    ) {
      let routeIfAlreadyAuthenticated = this.get('routeIfAlreadyAuthenticated');
      assert(
        'The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!',
        this.get('routeName') !== routeIfAlreadyAuthenticated
      );

      console.log('UnauthenticatedRouteMixin', 1);

      this.transitionTo(routeIfAlreadyAuthenticated);
    } else {
      console.log('UnauthenticatedRouteMixin', 2);
      return this._super(...arguments);
    }
  },
});
