import DS from 'ember-data';

const getType = type => type.modelName;

export default DS.Adapter.extend({
    id: 0,
    incId() {
        return this.id++;
    },
    generateIdForRecord() {
        return this.incId();
    },
    findRecord(store, type, id) {
        const record = store.peekRecord(getType(type), id);
        return Promise.resolve(record.serialize({ includeId: true }));
    },
    createRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });

        return Promise.resolve(data);
    },
    updateRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });

        // if (!storage[getType(type)]) return Promise.resolve([]);
        // storage[getType(type)][id] = data;

        // const record = store.peekRecord(getType(type), id);
        // record.set

        return Promise.resolve(data);
    },
    deleteRecord() {},
    findAll(store, type) {
        const records = store.peekAll(getType(type));
        return Promise.resolve(records);
    },
    query(store, type, query) {
        const [key, sorter] = [query.orderBy, query.equalTo];
        return this.findAll(store, type).then(records =>
            records.filter(item => item[key] === sorter)
        );
    },
});
