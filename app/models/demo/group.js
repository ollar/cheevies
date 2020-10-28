import { hasMany, belongsTo } from '@ember-data/model';
import GroupModel from '../group';

export default GroupModel.extend({
    users: hasMany('demo/user', { inverse: null }),
    cheevies: hasMany('demo/cheevie', { inverse: null }),
    author: belongsTo('demo/user', { inverse: null }),
    moderators: hasMany('demo/user', { inverse: null }),
});
