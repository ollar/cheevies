import Route from '@ember/routing/route';
import {
    hash
} from 'rsvp';
import {
    inject as service
} from '@ember/service';
import {
    computed
} from '@ember/object';

export default Route.extend({
    myGroup: service('my-group'),
    isDemo: computed.readOnly('myGroup.isDemo'),
    _type: computed('isDemo', function () {
        return this.isDemo ? 'demo/cheevie' : 'cheevie';
    }),
    model() {
        return hash({
            cheevie: this.get('store').createRecord(this._type),
            myGroup: this.myGroup.fetch(),
        });
    },

    actions: {
        willTransition() {
            let controller = this.controllerFor(this.routeName);
            controller.resetProperties();
            return true;
        },
    },
});
