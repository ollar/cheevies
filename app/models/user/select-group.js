import Model, { attr } from '@ember-data/model';
import {
    computed
} from '@ember/object';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
    group: attr('string'),

    validations: computed(() => ({
        group: {
            presence: true,
        },
    })),
});
