import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  description: attr('string'),
  cheevies: hasMany('cheevie'),
  group: belongsTo(),

  isComplete: attr('boolean'),
});
