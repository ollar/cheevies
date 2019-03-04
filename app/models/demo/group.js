import GroupModel from '../group';
import DS from 'ember-data';

export default GroupModel.extend({
    users: DS.hasMany('demo/user', { inverse: null }),
    cheevies: DS.hasMany('demo/cheevie', { inverse: null }),
    author: DS.belongsTo('demo/user', { inverse: null }),
    moderators: DS.hasMany('demo/user', { inverse: null }),
});
