import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

import getGroupCheevies from '../../utils/get-group-cheevies';

export default Route.extend({
    myGroup: service(),

    model() {
        return hash({
            user: this.modelFor('profile'),
            cheevies: this.myGroup.fetch().then(getGroupCheevies),
        }).then(({ user, cheevies }) => {
            const userCheevies = user.get('cheevies');
            return {
                cheevies: cheevies.filter(cheevie => userCheevies.indexOf(cheevie) < 0),
                user,
            };
        });
    },
});
