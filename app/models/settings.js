import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
    user: belongsTo('user'),

    pushNotifications: attr('boolean', { defaultValue: false }),

    sounds: attr('boolean', { defaultValue: false }),
    animations: attr('boolean', { defaultValue: true }),
    iconsDescription: attr('boolean', { defaultValue: true }),

    updated: attr('number'),
});
