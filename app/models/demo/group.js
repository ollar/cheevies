import GroupModel from '../group';
import DS from 'ember-data';

export default GroupModel.extend({
    users: DS.hasMany('demo/user'),
    cheevies: DS.hasMany('demo/cheevie'),
    author: DS.belongsTo('demo/user', { inverse: null }),
    moderators: DS.hasMany('demo/user', { inverse: null }),
});
