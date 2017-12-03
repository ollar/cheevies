import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  cheevies: DS.hasMany('cheevie'),
  imageUrl: DS.attr('string'),
  isComplete: DS.attr('boolean'),
});
