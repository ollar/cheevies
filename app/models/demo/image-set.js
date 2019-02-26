import DS from 'ember-data';
import ImageSetModel from '../image-set';

export default ImageSetModel.extend({
    '64': DS.belongsTo('demo/image'),
    '128': DS.belongsTo('demo/image'),
    '256': DS.belongsTo('demo/image'),
    '512': DS.belongsTo('demo/image'),
});
