import DS from 'ember-data';

export default DS.Model.extend({
    user: DS.belongsTo('user'),

    pushNotifications: DS.attr('boolean', { defaultValue: false }),

    sounds: DS.attr('boolean', { defaultValue: false }),
    animations: DS.attr('boolean', { defaultValue: true }),
    iconsDescription: DS.attr('boolean', { defaultValue: true }),

    updated: DS.attr('number'),
});
