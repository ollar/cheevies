import Model, { belongsTo } from '@ember-data/model';

export default Model.extend({
  // '32': DS.belongsTo('image'),
  '64': belongsTo('image'),
  '128': belongsTo('image'),
  '256': belongsTo('image'),
  '512': belongsTo('image'),
});
