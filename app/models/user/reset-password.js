import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';

export default Model.extend(Validator, {
    email: attr('string'),

    validations: computed(() => ({
        email: {
            presence: true,
            email: true,
        },
    })),
});
