import DS from 'ember-data';
import { resolve } from 'rsvp';

export default DS.Adapter.extend({
    init() {
        this._super();
        this.storage = {};
        this.id = 0;
    },
    incId() {
        return this.id++;
    },
    generateIdForRecord() {
        return this.incId();
    },
    findRecord() {},
    createRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });

        if (!this.storage[type]) this.storage[type] = {};

        this.storage[type][data.id] = data;

        return resolve(data);
    },
    updateRecord() {},
    deleteRecord() {},
    findAll() {},
    query() {},
});
