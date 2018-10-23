import Route from '@ember/routing/route';

export default Route.extend({
    userHasEnteredData() {
        return Object.keys(this.get('controller.model').changedAttributes()).length > 0;
    },

    actions: {
        willTransition() {
            if (this.userHasEnteredData()) {
                this.get('controller.model').save();
            }
            return true;
        },
    },
});
