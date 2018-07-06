import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  cheevies: DS.hasMany('cheevie'),
  users: DS.hasMany('user'),
});
