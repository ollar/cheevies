import Route from '@ember/routing/route';
import {
    inject as service
} from '@ember/service';

export default Route.extend({
    session: service(),

    beforeModel(transition) {
        if (this.session.isAuthenticated) {
            this.transitionTo('wardrobe.select-group');
            transition.abort();
        }
    },

    model() {
        return this.store.createRecord('user/signup');
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
