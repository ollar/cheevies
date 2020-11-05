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
        return this.session.data.authenticated.group;
    }

    get isDemo() {
        return this.session.data.authenticated.demoGroup;
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
            if (!this.groupName) throw new Error('group not filled');
            if (this.model) return this.model;

            return this.store
                .query(this._type, {
                    find: {
                        name: this.groupName
                    }
                })
                .then(_groups => {
                    const group = _groups.firstObject;
                    this.model = group;
                    return group;
                });
        });
    }
}
