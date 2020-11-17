import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return this.store.createRecord('user/reset-password');
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
