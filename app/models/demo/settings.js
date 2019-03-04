import DS from 'ember-data';
import SettingsModel from '../settings';

export default SettingsModel.extend({
    user: DS.belongsTo('demo/user', { inverse: null }),
});
