import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    myGroup: service(),

    model() {
        return hash({
            user: this.modelFor('profile'),
            cheevies: this.myGroup.fetch().then(group => group.get('cheevies')),
        }).then(({ user, cheevies }) => {
            const userCheevies = user.get('cheevies');
            return {
                cheevies: cheevies.filter(cheevie => userCheevies.indexOf(cheevie) < 0),
                user,
            };
        });
    },
});
