import { belongsTo } from '@ember-data/model';
import SettingsModel from '../settings';

export default SettingsModel.extend({
    user: belongsTo('demo/user', { inverse: null }),
});
