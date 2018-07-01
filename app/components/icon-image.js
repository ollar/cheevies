// import Component from '@ember/component';
import { computed } from '@ember/object';
import { addObserver } from '@ember/object/observers';

import Component from 'avatar-icon-component/components/avatar-icon';

export default Component.extend({
  init() {
    this._super(...arguments);
    addObserver(this, 'power', this.updateStyles);
  },
  classNameBindings: ['image:has-image'],
  name: computed('data.{displayName,name}', function() {
    if (Object.keys(this.get('data')).length === 0) return '';
    return (
      this.get('data').displayName ||
      (this.get('data').get && this.get('data').get('name')) ||
      'anonymous'
    );
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
      backgroundImage: this.get('data.imageUrl')
        ? `url(${this.get('data.imageUrl')})`
        : null,
      boxShadow: this.get('powerColour')
        ? `0 0 0 3px ${this.get('powerColour')}`
        : null,
    });
  },
});
