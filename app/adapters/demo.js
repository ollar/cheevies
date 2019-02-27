import DS from 'ember-data';

export default DS.Adapter.extend({
    defaultSerializer: 'demo',
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
    findRecord(store, type, id, snapshot) {
        console.log(snapshot);

        return this.storage[type][id];
    },
    createRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });

        if (!this.storage[type]) this.storage[type] = {};

        this.storage[type][data.id] = data;

        return data;
    },
    updateRecord() {},
    deleteRecord() {},
    findAll() {},
    query() {},
});
