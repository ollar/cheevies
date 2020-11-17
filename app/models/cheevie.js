import Model, { belongsTo, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import Validator from '../mixins/model-validator';

export default Model.extend(Validator, {
    rates: computed(() => ['high', 'normal', 'low']),

    'image-set': belongsTo('image-set'),
    group: belongsTo(),
    author: belongsTo('user', { inverse: null }),
    name: attr('string'),
    description: attr('string'),
    power: attr('string', { defaultValue: 'low' }),
    deleted: attr('boolean', { defaultValue: false }),

    validations: computed(() => ({
        name: {
            presence: true,
        },
    })),
});
