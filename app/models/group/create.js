import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';

export default Model.extend(Validator, {
    name: attr('string'),

    validations: computed(() => ({
        name: {
            presence: true,
        },
    })),
});
