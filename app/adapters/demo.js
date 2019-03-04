import DS from 'ember-data';

let id = 0;
const getType = type => type.modelName;
const getId = () => id++;

export default DS.Adapter.extend({
    generateIdForRecord() {
        return getId();
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
        return Promise.resolve(data);
    },
    deleteRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });
        return Promise.resolve(data);
    },
    findAll(store, type) {
        const records = store.peekAll(getType(type));
        return Promise.resolve(records);
    },
    query(store, type, query) {
        const [key, sorter] = [query.orderBy, query.equalTo];
        return this.findAll(store, type).then(records =>
            records
                .filter(item => item[key] === sorter)
                .map(item => this.serialize(item, { includeId: true }))
        );
    },
});
