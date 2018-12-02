import DS from 'ember-data';
import {
    computed
} from '@ember/object';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator, {
    group: DS.attr('string'),

    validations: computed(() => ({
        group: {
            presence: true,
        },
    })),
});
