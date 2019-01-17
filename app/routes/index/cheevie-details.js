import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        willTransition() {
            let controller = this.controllerFor(this.routeName);
            controller.resetProperties();
            return true;
        },
    },
});
