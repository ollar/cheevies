import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { hash } from 'rsvp';

export default Route.extend({
    me: service(),
    myGroup: service('my-group'),

    model() {
        return hash({
            myGroup: this.myGroup.fetch(),
            me: this.me.fetch(),
        })
            .then(({ myGroup, me }) => ({
                availableCheevies: myGroup.get('cheevies'),
                unseenCheevies: me.get('unseenCheevies'),
            }))
            .then(({ availableCheevies, unseenCheevies }) =>
                unseenCheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
            );
    },

    actions: {
        willTransition() {
            const model = this.me.model;
            model.set('unseenCheevies', []);
            model.save();
            return true;
        },
    },
});
