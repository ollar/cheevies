import Model, { attr } from '@ember-data/model';

export default class ImageSetModel extends Model{
    @attr '64';
    @attr '128';
    @attr '256';
    @attr '512';
}
