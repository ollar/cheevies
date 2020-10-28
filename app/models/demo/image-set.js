import { belongsTo } from '@ember-data/model';
import ImageSetModel from '../image-set';

export default ImageSetModel.extend({
    '64': belongsTo('demo/image', { inverse: null }),
    '128': belongsTo('demo/image', { inverse: null }),
    '256': belongsTo('demo/image', { inverse: null }),
    '512': belongsTo('demo/image', { inverse: null }),
});
