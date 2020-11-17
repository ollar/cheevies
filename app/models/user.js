import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
    username: attr('string'),
    'image-set': belongsTo('image-set'),
    email: attr('string'),
    fcmToken: attr('string'),

    providerId: attr('string', { defaultValue: 'email' }),
    accessToken: attr('string'),
    photoURL: attr('string'),

    cheevies: hasMany('cheevie', { inverse: null }),
    unseenCheevies: hasMany('cheevie', { inverse: null }),
    badges: hasMany('badge', { inverse: null }),

    created: attr('number'),
    groups: hasMany('group', { inverse: null }),

    settings: belongsTo('setting'),
});
