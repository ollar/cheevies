import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    session: service(),
    me: service(),

    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'wardrobe.sign-in');
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
