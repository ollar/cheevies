import Mixin from '@ember/object/mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { getOwner } from '@ember/application';

export default Mixin.create(AuthenticatedRouteMixin, {
  beforeModel(transition) {
    if (
      !this.get('session.isAuthenticated') ||
      !this.get('session.data.group')
    ) {
      if (this.get('_isFastBoot')) {
        const fastboot = getOwner(this).lookup('service:fastboot');
        const cookies = getOwner(this).lookup('service:cookies');

        cookies.write(
          'ember_simple_auth-redirectTarget',
          transition.intent.url,
          {
            path: '/',
            secure: fastboot.get('request.protocol') === 'https',
          }
        );
      } else {
        this.set('session.attemptedTransition', transition);
      }

      this.triggerAuthentication();
    } else {
      return this._super(...arguments);
    }
  },
});
