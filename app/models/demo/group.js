import GroupModel from '../group';
import DS from 'ember-data';

export default GroupModel.extend({
    users: DS.hasMany('demo/user'),
    author: DS.belongsTo('demo/user', { inverse: null }),
    moderators: DS.hasMany('demo/user', { inverse: null }),
});
