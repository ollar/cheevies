import DS from 'ember-data';

export default DS.Model.extend({
  init() {
    this._super(...arguments);
    this.rates = {
      low: 'green',
      normal: 'yellow',
      high: 'red',
    };
  },

  'image-set': DS.belongsTo('image-set'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  power: DS.attr('string', { defaultValue: 'low' }),
});
