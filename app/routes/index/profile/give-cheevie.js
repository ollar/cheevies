import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    myGroup: service(),

    model() {
        return this.modelFor('index.profile');



        return hash({
            user: this.modelFor('index.profile'),
            cheevies: this.myGroup.get('cheevies'),
        }).then(async ({ user, cheevies: groupCheevies }) => {
            const userCheevies = await user.get('cheevies');

            console.log(userCheevies.toArray())
            console.log(groupCheevies.toArray())
            console.log(groupCheevies.filter(cheevie => !userCheevies.includes(cheevie)))

            return {
                // cheevies: groupCheevies.filter(cheevie => !userCheevies.includes(cheevie)),
                cheevies: groupCheevies.filter(cheevie => !userCheevies.includes(cheevie)),
                user,
            };
        });
    },
});
