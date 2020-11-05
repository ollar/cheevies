import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class GroupModel extends Model {
    @attr('string') name;
    @hasMany('cheevie', { inverse: null }) cheevies;
    @hasMany('user', { inverse: null }) users;
    @attr('boolean', { defaultValue: false }) locked;
    @attr('string', { defaultValue: '0000' }) code;
    @belongsTo('user', { inverse: null }) author;
    @hasMany('user', { inverse: null }) moderators;
    @attr('string', { defaultValue: 'anarchy' }) policy;

    get policies() {
        return ['anarchy', 'democracy', 'totalitarianism'];
    }
}
