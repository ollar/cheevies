import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  afterModel() {
    this.get('store').findAll('cheevie').then(res => {
      this.set('controller.cheevies', res);
    });
  },
});
