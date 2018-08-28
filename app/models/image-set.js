import DS from 'ember-data';

export default DS.Model.extend({
  // '32': DS.belongsTo('image'),
  '64': DS.belongsTo('image'),
  '128': DS.belongsTo('image'),
  '256': DS.belongsTo('image'),
  '512': DS.belongsTo('image'),
});
