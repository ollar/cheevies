import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
    rates: computed(() => ['high', 'normal', 'low']),

    'image-set': DS.belongsTo('image-set'),
    group: DS.belongsTo(),
    name: DS.attr('string'),
    description: DS.attr('string'),
    power: DS.attr('string', { defaultValue: 'low' }),
    deleted: DS.attr('boolean', { defaultValue: false }),
});
