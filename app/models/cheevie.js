import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  imageUrl: DS.attr('string'),
  power: DS.attr('string', {defaultValue: 'low'}),

  rates: {
    low: 'green',
    normal: 'yellow',
    high: 'red',
  }
});
