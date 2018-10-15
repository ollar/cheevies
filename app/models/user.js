import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    'image-set': DS.belongsTo('image-set'),
    email: DS.attr('string'),
    fcmToken: DS.attr('string'),

    cheevies: DS.hasMany('cheevie'),
    unseenCheevies: DS.hasMany('cheevie'),
    badges: DS.hasMany('badge'),

    created: DS.attr('number'),
    groups: DS.hasMany('group'),

    // settings: DS.belongsTo('settings'),
});
