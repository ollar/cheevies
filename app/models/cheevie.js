import DS from 'ember-data';
import { computed } from '@ember/object';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    rates: computed(() => ['high', 'normal', 'low']),

    'image-set': DS.belongsTo('image-set'),
    group: DS.belongsTo(),
    author: DS.belongsTo('user', { inverse: null }),
    name: DS.attr('string'),
    description: DS.attr('string'),
    power: DS.attr('string', { defaultValue: 'low' }),
    deleted: DS.attr('boolean', { defaultValue: false }),

    validations: computed(() => ({
        name: {
            presence: true,
        },
    })),
});
