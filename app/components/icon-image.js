import { computed } from '@ember/object';
import Component from 'avatar-icon-component/components/avatar-icon';
import { isEmpty } from '@ember/utils';

export default Component.extend({
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
      backgroundColor: this.get('backgroundColour'),
      height: this._size,
      width: this._size,
      lineHeight: this._size + 'px',
      boxShadow: this.get('powerColour')
        ? `0 0 0 3px ${this.get('powerColour')}`
        : null,
    });
  },
});
