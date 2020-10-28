import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
    group: belongsTo('group'),
    user: belongsTo('user'),
    cheevie: belongsTo('cheevie'),
    action: attr('string'),
    text: attr('string', { defaultValue: '' }),
    created: attr('number'),
});
