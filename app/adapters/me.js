import ApplicationAdapter from './application';
import { underscore } from '@ember/string';
import { singularize } from 'ember-inflector';

export default class MeAdapter extends ApplicationAdapter {
    namespace = '';

    pathForType(modelName) {
        return singularize(underscore(modelName));
    }

    urlForUpdateRecord(id) {
        return `${super.host}/${super.namespace}/users/${id}`;
    }
}
