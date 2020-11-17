import { belongsTo } from '@ember-data/model';
import CheevieModel from '../cheevie';

export default CheevieModel.extend({
    'image-set': belongsTo('demo/image-set', { inverse: null }),
    group: belongsTo('demo/group', { inverse: null }),
    author: belongsTo('demo/user', { inverse: null }),
});
