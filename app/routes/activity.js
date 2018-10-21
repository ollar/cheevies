import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    myGroup: service('my-group'),
    activity: service(),

    model() {
        return this.activity.fetch();
    },
});
