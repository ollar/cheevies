import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../../mixins/unauthenticated-route-mixin';
import {
    inject as service
} from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    session: service(),

    beforeModel(transition) {
        if (this.session.isAuthenticated) {
            this.transitionTo('wardrobe.select-group');
            transition.abort();
        }
    },

    model() {
        return this.store.createRecord('user/signup', {
            type: 'email',
        });
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
