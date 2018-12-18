import DS from 'ember-data';
import Validator from '../mixins/model-validator';
import { computed } from '@ember/object';

export default DS.Model.extend(Validator, {
    policies: computed(() => ['anarchy', 'democracy', 'totalitarianism']),

    name: DS.attr('string'),
    cheevies: DS.hasMany('cheevie'),
    users: DS.hasMany('user'),
    locked: DS.attr('boolean', { defaultValue: false }),
    code: DS.attr('string', { defaultValue: '0000' }),
    author: DS.belongsTo('user', { inverse: null }),
    moderators: DS.hasMany('user', { inverse: null }),
    policy: DS.attr('string', { defaultValue: 'anarchy' }),

    validations: computed(() => ({
        name: {
            presence: true,
        },
        code: {
            presence: true,
        },
    })),
});
