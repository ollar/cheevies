import Route from '@ember/routing/route';
import {
    inject as service
} from '@ember/service';
import {
    run
} from '@ember/runloop';

export default Route.extend({
    session: service(),
    beforeModel() {
        return run(() => {
            try {
                this.store.unloadAll();
            } catch (e) {
                /* eslint-disable */
                console.error(e);
            }

            run(() => {
                this.get('session')
                    .invalidate()
                    .then(() => this.get('router').transitionTo('wardrobe.social-sign-in'));
            });
        });
    },
});
