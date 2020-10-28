import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from '../../mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';

export default Route.extend(UnauthenticatedRouteMixin, {
    session: service(),
    firebase: service('firebase-app'),

    beforeModel(transition) {
        if (this.session.isAuthenticated) {
            this.transitionTo('wardrobe.select-group');
            transition.abort();
        }
    },

    model() {
        return this.store.createRecord('user/signin', {
            type: 'social',
        });
    },

    activate() {
        if (window.localStorage.getItem('awaitForSignInRedirect')) {
            let controller = this.controllerFor(this.routeName);
            return resolve()
                .then(() => {
                    controller.setBusy(true);
                    return this.firebase.auth()
                        .then(auth => auth.getRedirectResult())
                        .then(result => controller.onSuccess(result))
                        .catch(error => controller.onError(error));
                })
                .finally(() => controller.setBusy(false));
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
