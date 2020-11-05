import Model, { belongsTo, attr } from '@ember-data/model';

export default class SettingsModel extends Model {
    @belongsTo('user') user;
    @attr('boolean', { defaultValue: false }) pushNotifications;
    @attr('boolean', { defaultValue: false }) sounds;
    @attr('boolean', { defaultValue: true }) animations;
    @attr('boolean', { defaultValue: true }) iconsDescription;
    @attr('number') updated;
}
