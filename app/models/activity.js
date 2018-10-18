import DS from 'ember-data';

export default DS.Model.extend({
    group: DS.belongsTo('group'),
    user: DS.belongsTo('user'),
    cheevies: DS.hasMany('cheevie'),
    _data: DS.attr(),
    created: DS.attr('number'),
});
