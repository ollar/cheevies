import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  imageUrl: DS.attr('string'),
  email: DS.attr('string'),

  cheevies: DS.hasMany('cheevie'),
  badges: DS.hasMany('badge'),
});
