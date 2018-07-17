import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from 'web-animation-middleware';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  me: service(),
  session: service(),
  myGroup: computed.readOnly('session.data.group'),

  model() {
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
    // return hash({
    //   me: this.me.fetch(),
    //   users: this.get('store').findAll('user'),
    //   badges: this.get('store').findAll('badge'),
    //   cheevies: this.get('store').findAll('cheevie'),
    // });
  },

  activate() {
    const am = new Middleware();
    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');
      am.prepare($iconImages, { transform: 'scale(0.5)', opacity: 0 });

      am.chain(
        $iconImages,
        [
          { transform: 'scale(0.5)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 24,
          fill: 'forwards',
        }
      );
      schedule('afterRender', () => {
        // am.go(() => true);
      });
    });
  },
});
