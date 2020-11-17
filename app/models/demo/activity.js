import { belongsTo } from '@ember-data/model';
import ActivityModel from '../activity';

export default ActivityModel.extend({
    group: belongsTo('demo/group', { inverse: null }),
    user: belongsTo('demo/user', { inverse: null }),
    cheevie: belongsTo('demo/cheevie', { inverse: null }),
});
