import { belongsTo, hasMany } from '@ember-data/model';
import UserModel from '../user';

export default UserModel.extend({
    'image-set': belongsTo('demo/image-set', { inverse: null }),
    cheevies: hasMany('demo/cheevie', { inverse: null }),
    unseenCheevies: hasMany('demo/cheevie', { inverse: null }),
    groups: hasMany('demo/group', { inverse: null }),
    settings: belongsTo('demo/settings', { inverse: null }),
});
