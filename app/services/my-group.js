import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { filterBy } from '@ember/object/computed';

export default class MyGroupService extends Service {
    @service session;
    @service store;
    @filterBy('model.cheevies', 'deleted', false) cheevies;
    @tracked model = null;

    get isAuthenticated() {
        return this.session.isAuthenticated;
    }

    get groupName() {
        return this.session.data.group;
    }

    get isDemo() {
        return this.session.data.demoGroup;
    }

    get _type() {
        return this.isDemo ? 'demo/group' : 'group';
    }

    constructor() {
        super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.model = null;
        });
    }

    fetch() {
        return Promise.resolve().then(() => {
            if (!this.groupName) throw new Error('session.data.group not filled');
            if (this.model) return this.model;

            return this.store
                .query(this._type, {
                    orderBy: 'name',
                    equalTo: this.groupName,
                })
                .then(_group => {
                    const group = _group.firstObject;
                    this.model = group;
                    return group;
                });
        });
    }
}
