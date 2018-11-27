import DS from 'ember-data';
import Validator from '../mixins/model-validator';
import { computed } from '@ember/object';

export default DS.Model.extend(Validator, {
    name: DS.attr('string'),
    cheevies: DS.hasMany('cheevie'),
    users: DS.hasMany('user'),
    locked: DS.attr('boolean', { defaultValue: false }),
    code: DS.attr('string', { defaultValue: '0000' }),

    validations: computed(() => ({
        name: {
            presence: true,
        },
        code: {
            presence: true,
        },
    })),
});
