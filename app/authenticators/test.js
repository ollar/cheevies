import Base from 'ember-simple-auth/authenticators/base';
import { resolve } from 'rsvp';

export default Base.extend({
    restore(data) {
        return resolve(data);
    },

    authenticate(data) {
        return resolve(data);
    },

    invalidate() {
        return resolve();
    },
});
