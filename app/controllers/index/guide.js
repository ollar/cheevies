import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        goBack() {
            this.transitionToRoute('index');
        },
    },
});
