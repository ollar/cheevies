import Component from '@ember/component';
import { computed } from '@ember/object';


export default Component.extend({
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
  name: computed('data.{displayName,name}', function() {
    if (Object.keys(this.get('data')).length === 0) return '';
    return this.get('data').displayName ||
      (this.get('data').get && this.get('data').get('name')) ||
      'anonymous';
  }),
  initials: computed('name', function() {
    if (!this.get('name')) return '';
    return this.get('name')
      .trim()
      .split(' ')
      .map(item => item[0].toUpperCase())
      .slice(0,2)
      .join('');
  }),
  backgroundColour: computed('name', function() {
    if (!this.get('name')) return '';
    var colourNumber = this.get('name')
      .trim()
      .split('')
      .map((item) => item.charCodeAt())
      .reduce((sum, i) => sum + i);

    var index = colourNumber % this.get('colours').length;

    return this.get('colours')[index];
  }),
  didRender() {
    this._super(...arguments);
    console.log(this.get('data.imageUrl'))
    this.$().css({
      backgroundColor: this.get('backgroundColour'),
      height: this.attrs.size,
      width: this.attrs.size,
      lineHeight: this.attrs.size + 'px',
      backgroundImage: `url(${this.get('data.imageUrl')})`,
      backgroundSize: 'cover',
    });
  },
});
