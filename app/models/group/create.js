import DS from 'ember-data';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';

export default DS.Model.extend(Validator, {
    name: DS.attr('string'),

    validations: computed(() => ({
        name: {
            presence: true,
        },
    })),
});
