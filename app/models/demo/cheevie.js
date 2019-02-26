import DS from 'ember-data';
import CheevieModel from '../cheevie';

export default CheevieModel.extend({
    'image-set': DS.belongsTo('demo/image-set'),
    group: DS.belongsTo('demo/group'),
    author: DS.belongsTo('demo/user', { inverse: null }),
});
