import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    session: service(),
    router: service(),

    beforeModel() {
        return this.session.invalidate()
                    // .then(() => this.router.transitionTo('wardrobe.sign-in'));
    },
});
