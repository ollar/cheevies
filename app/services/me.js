import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';

export default class MeService extends Service {
    @service session;
    @service store;
    @tracked model = null;

    get appName() {
        return getOwner(this).application.appName;
    }

    get isAuthenticated() {
        return this.session.isAuthenticated;
    }

    constructor() {
        super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.model = null;
        });
    }

    fetch() {
        if (!this.isAuthenticated || this.model) return Promise.resolve(this.model);

        return this.store.queryRecord('me', {
            collection_name: this.appName
        }).then(me => {
            this.model = me;
            return me;
        });
    }
}
