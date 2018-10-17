import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default Service.extend({
    session: service(),
    store: service(),

    isAuthenticated: computed.readOnly('session.isAuthenticated'),

    uid: computed('isAuthenticated', function() {
        return this.isAuthenticated
            ? this.getWithDefault('session.data.authenticated.uid', '')
            : '';
    }),

    init() {
        this._super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.set('model', null);
        });
    },

    fetch() {
        return resolve().then(() => {
            if (!this.uid) throw new Error('session.data.authenticated.uid not filled');
            if (this.model) return this.model;

            return this.get('store')
                .findRecord('user', this.uid)
                .then(user => {
                    this.set('model', user);
                    return user;
                });
        });
    },

    model: null,
});
