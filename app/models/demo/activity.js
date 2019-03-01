import DS from 'ember-data';
import ActivityModel from '../activity';

export default ActivityModel.extend({
    group: DS.belongsTo('demo/group'),
    user: DS.belongsTo('demo/user'),
    cheevie: DS.belongsTo('demo/cheevie'),
});
