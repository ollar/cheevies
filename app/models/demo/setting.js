import { belongsTo } from '@ember-data/model';
import SettingsModel from '../setting';

export default SettingsModel.extend({
    user: belongsTo('demo/user', { inverse: null }),
});
