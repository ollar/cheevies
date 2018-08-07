import { computed } from '@ember/object';
import Component from 'avatar-icon-component/components/avatar-icon';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  colours: computed(() => [
    ['#FF0000', '#4838FF'],
    ['#4838FF', '#1D2349'],
    ['#CD04FF', '#BA0064'],
    ['#0075FF', '#FF008A'],
    ['#FF5C00', '#FF0000'],
    ['#FFEC87', '#FF0000'],
  ]),

  name: computed('data.name', function() {
    if (isEmpty(this.data)) return '';
    return this.getWithDefault('data.name', 'anonymous');
  }),

  power: computed.readOnly('data.power'),

  powerColour: computed('power', function() {
    if (!this.get('power')) return;
    return this.get('data.rates')[this.get('power')];
  }),

  updateStyles() {
    this.$().css({
      background: `linear-gradient(210deg,
        ${this.get('backgroundColour')[0]},
        ${this.get('backgroundColour')[1]}
      )`,
      height: this._size,
      width: this._size,
      lineHeight: this._size + 'px',
      boxShadow: this.get('powerColour')
        ? `0 0 0 3px ${this.get('powerColour')}`
        : null,
    });
  },
});
