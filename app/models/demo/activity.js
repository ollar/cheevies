import DS from 'ember-data';
import ActivityModel from '../activity';

export default ActivityModel.extend({
    group: DS.belongsTo('demo/group', { inverse: null }),
    user: DS.belongsTo('demo/user', { inverse: null }),
    cheevie: DS.belongsTo('demo/cheevie', { inverse: null }),
});
