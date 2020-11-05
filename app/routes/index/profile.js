import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class IndexProfileRoute extends Route {
    get userHasEnteredData() {
        return Object.keys(this.controller.model.changedAttributes()).length > 0;
    }

    @action
    willTransition() {
        if (this.userHasEnteredData) {
            this.controller.model.save();
        }
        return true;
    }
}
