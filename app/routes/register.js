import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
    model() {
        return this.get('store').createRecord('user/signup');
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
