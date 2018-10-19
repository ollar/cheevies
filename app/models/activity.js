import DS from 'ember-data';

export default DS.Model.extend({
    group: DS.belongsTo('group'),
    user: DS.belongsTo('user'),
    cheevie: DS.belongsTo('cheevie'),
    action: DS.attr('string'),
    text: DS.attr('string', { defaultValue: '' }),
    created: DS.attr('number'),
});
