import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  cheevies: DS.hasMany('cheevie'),
  group: DS.belongsTo(),

  isComplete: DS.attr('boolean'),
});
