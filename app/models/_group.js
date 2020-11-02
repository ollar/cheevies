import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import Validator from '../mixins/model-validator';
import { computed } from '@ember/object';

export default Model.extend(Validator, {
    policies: computed(() => ['anarchy', 'democracy', 'totalitarianism']),

    name: attr('string'),
    cheevies: hasMany('cheevie'),
    users: hasMany('user'),
    locked: attr('boolean', { defaultValue: false }),
    code: attr('string', { defaultValue: '0000' }),
    author: belongsTo('user', { inverse: null }),
    moderators: hasMany('user', { inverse: null }),
    policy: attr('string', { defaultValue: 'anarchy' }),

    validations: computed(() => ({
        name: {
            presence: true,
        },
        code: {
            presence: true,
        },
    })),
});
