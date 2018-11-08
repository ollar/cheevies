import DS from 'ember-data';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';

export default DS.Model.extend(Validator, {
    email: DS.attr('string'),

    validations: computed(() => ({
        email: {
            presence: true,
            email: true,
        },
    })),
});
