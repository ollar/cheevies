import DS from 'ember-data';
import CheevieModel from '../cheevie';

export default CheevieModel.extend({
    'image-set': DS.belongsTo('demo/image-set', { inverse: null }),
    group: DS.belongsTo('demo/group', { inverse: null }),
    author: DS.belongsTo('demo/user', { inverse: null }),
});
