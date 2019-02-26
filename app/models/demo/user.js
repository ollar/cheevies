import UserModel from '../user';
import DS from 'ember-data';

export default UserModel.extend({
    'image-set': DS.belongsTo('demo/image-set'),
    cheevies: DS.hasMany('demo/cheevie'),
    unseenCheevies: DS.hasMany('demo/cheevie'),
    groups: DS.hasMany('demo/group'),
    settings: DS.belongsTo('demo/settings'),
});
