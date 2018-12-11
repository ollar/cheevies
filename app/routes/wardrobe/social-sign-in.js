import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../../mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default Route.extend(UnauthenticatedRouteMixin, {
    session: service(),

    beforeModel(transition) {
        if (this.session.isAuthenticated) {
            this.transitionTo('wardrobe.select-group');
            transition.abort();
        }
    },

    model() {
        return this.get('store').createRecord('user/signin', {
            type: 'social',
        });
    },

    activate() {
        if (window.localStorage.getItem('awaitForSignInRedirect')) {
            firebase
                .auth()
                .getRedirectResult()
                .then(result => {
                    this.controllerFor(this.routeName).onSuccess(result);
                })
                .catch(error => {
                    this.controllerFor(this.routeName).onError(error);
                });
        }
    },

    actions: {
        willTransition() {
            const model = this.get('controller.model');
            if (!model.pendingCred) model.destroyRecord();
            return true;
        },
    },
});
