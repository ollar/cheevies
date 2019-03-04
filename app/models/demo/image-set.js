import DS from 'ember-data';
import ImageSetModel from '../image-set';

export default ImageSetModel.extend({
    '64': DS.belongsTo('demo/image', { inverse: null }),
    '128': DS.belongsTo('demo/image', { inverse: null }),
    '256': DS.belongsTo('demo/image', { inverse: null }),
    '512': DS.belongsTo('demo/image', { inverse: null }),
});
