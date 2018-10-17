import DS from 'ember-data';

export default DS.Model.extend({
    group: DS.belongsTo('group'),
    user: DS.belongsTo('user'),
    cheevie: DS.belongsTo('cheevie'),
    data: DS.attr(),
});
