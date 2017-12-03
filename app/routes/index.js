import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model(urlParams, transition) {
    return RSVP.hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },
});
