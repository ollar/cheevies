import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    myGroup: service('my-group'),

    model() {
        return this.store.query('activity', {
            orderBy: 'group',
            equalTo: this.myGroup.model.id,
        });
    },
});
