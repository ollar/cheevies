import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return this.get('store').createRecord('group/create');
    },

    actions: {
        willTransition() {
            this.get('controller.model').destroyRecord();
            return true;
        },
    },
});
