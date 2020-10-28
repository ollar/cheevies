import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Route.extend({
    session: service(),
    router: service(),

    beforeModel() {
        return run(() => {
            try {
                this.store.unloadAll();
            } catch (e) {
                /* eslint-disable */
                console.error(e);
            }

            run(() => {
                this.session
                    .invalidate()
                    .then(() => this.router.transitionTo('wardrobe.social-sign-in'));
            });
        });
    },
});
