import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
    model() {
        return this.store.createRecord('user/signin', {
            type: 'social',
        });
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
