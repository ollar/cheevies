import Base from './firebase';
import { resolve } from 'rsvp';

export default Base.extend({
    authenticate(data) {
        return resolve(data);
    },
});
