import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../../mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
    session: service(),
    me: service(),

    beforeModel(transition) {
        if (!this.session.isAuthenticated) {
            this.transitionTo('wardrobe.social-sign-in');
            transition.abort();
        }
    },

    model() {
        return this.me.fetch().then(() => {
            return this.store.createRecord('user/select-group');
        });
    },

    actions: {
        activate() {
            this.me.fetch();
        },

        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
