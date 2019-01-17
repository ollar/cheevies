import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    myGroup: service('my-group'),
    model() {
        return hash({
            cheevie: this.get('store').createRecord('cheevie'),
            myGroup: this.myGroup.fetch(),
        });
    },

    actions: {
        willTransition() {
            let controller = this.controllerFor(this.routeName);
            controller.resetProperties();
            return true;
        },
    },
});
