import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
    username: attr('string'),
    'image-set': belongsTo('image-set'),
    email: attr('string'),
    fcmToken: attr('string'),

    providerId: attr('string', { defaultValue: 'email' }),
    accessToken: attr('string'),
    photoURL: attr('string'),

    cheevies: hasMany('cheevie'),
    unseenCheevies: hasMany('cheevie'),
    badges: hasMany('badge'),

    created: attr('number'),
    groups: hasMany('group'),

    settings: belongsTo('setting'),
});
