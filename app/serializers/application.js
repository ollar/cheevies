import RestSerializer from '@ember-data/serializer/rest';

export default class ApplicationSerializer extends RestSerializer{
    primaryKey = '_id';

    serializeIntoHash(hash, typeClass, snapshot, options) {
        let data = this.serialize(snapshot, options);

        Object.keys(data).forEach(key => {
            hash[key] = data[key];
        });
    }

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        let data = {
            [primaryModelClass.modelName]: payload
        }
        return super.normalizeArrayResponse(store, primaryModelClass, data, id, requestType);
    }

    normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
        let data = {
            [primaryModelClass.modelName]: payload
        };
        return super.normalizeSingleResponse(store, primaryModelClass, data, id, requestType);
    }
}
