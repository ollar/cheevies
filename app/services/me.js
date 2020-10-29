import Service, { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import { tracked } from '@glimmer/tracking';


export default class MeService extends Service {
    @service session;
    @service store;
    @service myGroup;

    @tracked model = null;

    get isDemo() {
        return this.myGroup.isDemo;
    }

    get _type() {
        return this.isDemo ? 'demo/user' : 'user';
    }


    get uid() {
        return this.isAuthenticated
            ? (this.get('session.data.authenticated.uid') || '') : '';
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
        return resolve().then(() => {
            if (!this.uid) throw new Error('session.data.authenticated.uid not filled');
            if (this.model) return this.model;

            return this.store.findRecord(this._type, this.uid).then(me => {
                this.model = me;
                return me;
            });
        });
    }
}
