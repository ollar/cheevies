import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../../mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    session: service(),

    beforeModel(transition) {
        if (!this.session.isAuthenticated) {
            this.transitionTo('wardrobe.sign-in');
            transition.abort();
        }
    },

    model() {
        return this.get('store').createRecord('user/signin', {
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
