import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  fullPath: DS.attr('string'),

  type: DS.attr('string'),
  name: DS.attr('string'),
  size: DS.attr('number'),
  width: DS.attr('number'),
  height: DS.attr('number'),

  created: DS.attr('number'),
});
