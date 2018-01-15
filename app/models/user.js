import DS from 'ember-data';
import { computed } from '@ember/object';

const poinsMap = {
  low: 10,
  normal: 20,
  high: 30,
};

export default DS.Model.extend({
  name: DS.attr('string'),
  imageUrl: DS.attr('string'),
  email: DS.attr('string'),
  fcmToken: DS.attr('string'),

  cheevies: DS.hasMany('cheevie'),
  unseenCheevies: DS.hasMany('cheevie'),
  badges: DS.hasMany('badge'),

  exp: computed('cheevies', 'badges', function() {
    const exp = this.get('cheevies').reduce((sum, item) => {
      return sum + poinsMap[item.get('power')];
    }, 0);

    return exp;
  }),
});
