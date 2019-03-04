import UserModel from '../user';
import DS from 'ember-data';

export default UserModel.extend({
    'image-set': DS.belongsTo('demo/image-set', { inverse: null }),
    cheevies: DS.hasMany('demo/cheevie', { inverse: null }),
    unseenCheevies: DS.hasMany('demo/cheevie', { inverse: null }),
    groups: DS.hasMany('demo/group', { inverse: null }),
    settings: DS.belongsTo('demo/settings', { inverse: null }),
});
