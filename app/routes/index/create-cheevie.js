import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  myGroup: service(),
  model() {
    return hash({
      cheevie: this.get('store').createRecord('cheevie'),
      myGroup: this.myGroup.fetch(),
    });
  },
});
