import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';

export default Base.extend({
    session: service(),

    restore(data) {
        return resolve(data);
    },

    authenticate(data) {
        return resolve(data);
    },

    invalidate() {
        // this.session.set('data.group', null);
        // this.session.set('data.demoGroup', null);

        return resolve();
    },
});
