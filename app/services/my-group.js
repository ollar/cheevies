import { readOnly, filterBy } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default Service.extend({
    session: service(),
    store: service(),

    isAuthenticated: readOnly('session.isAuthenticated'),
    groupName: readOnly('session.data.group'),
    isDemo: readOnly('session.data.demoGroup'),
    model: null,
    _type: computed('isDemo', function() {
        return this.isDemo ? 'demo/group' : 'group';
    }),

    init() {
        this._super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.set('model', null);
        });
    },

    cheevies: filterBy('model.cheevies', 'deleted', false),

    fetch() {
        return resolve().then(() => {
            if (!this.groupName) throw new Error('session.data.group not filled');
            if (this.model) return this.model;

            return this.get('store')
                .query(this._type, {
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
