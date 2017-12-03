import Component from '@ember/component';
import { computed } from '@ember/object';


export default Component.extend({
  classNames: ['user-avatar'],
  colours: [
    '#b71c1c',
    '#880e4f',
    '#4a148c',
    '#01579b',
    '#006064',
    '#827717',
    '#f57f17',
    '#e65100',
    '#bf360c',
    '#3e2723',
  ],
  name: computed('user.{displayName,name}', function() {
    if (Object.keys(this.get('user')).length === 0) return '';
    return this.get('user').displayName ||
      (this.get('user').get && this.get('user').get('name')) ||
      'anonymous';
  }),
  initials: Ember.computed('name', function() {
    if (!this.get('name')) return '';
    return this.get('name')
      .split(' ')
      .map(item => item[0].toUpperCase())
      .slice(0,2)
      .join('');
  }),
  backgroundColour: Ember.computed('name', function() {
    if (!this.get('name')) return '';
    var colourNumber = this.get('name')
      .split('')
      .map((item) => item.charCodeAt())
      .reduce((sum, i) => sum + i);

    var index = colourNumber % this.get('colours').length;

    return this.get('colours')[index];
  }),
  didRender() {
    this._super(...arguments);
    this.$().css({
      'backgroundColor': this.get('backgroundColour'),
      height: this.attrs.size,
      width: this.attrs.size,
    });
  },
});
