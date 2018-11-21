import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import DS from 'ember-data';

export default Service.extend({
    session: service(),
    store: service(),

    isAuthenticated: computed.readOnly('session.isAuthenticated'),
    groupName: computed.readOnly('session.data.group'),
    model: null,

    init() {
        this._super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.set('model', null);
        });
    },

    cheevies: computed.filterBy('model.cheevies', 'deleted', false),

    fetch() {
        return resolve().then(() => {
            if (!this.groupName) throw new Error('session.data.group not filled');
            if (this.model) return this.model;

            return this.get('store')
                .query('group', {
                    orderBy: 'name',
                    equalTo: this.groupName,
                })
                .then(_group => {
                    const group = _group.firstObject;
                    this.set('model', group);
                    return group;
                });
        });
    },
});
