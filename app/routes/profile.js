import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    settings: service(),

    userHasEnteredData() {
        return Object.keys(this.get('controller.model').changedAttributes()).length > 0;
    },

    activate() {
        this.settings.fetch();
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
