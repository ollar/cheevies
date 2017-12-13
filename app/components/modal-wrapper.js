import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this.$('.modal-background')[0].animate([
      { opacity: 0 },
      { opacity: 1 },
    ], 100);

    this.$('.modal-content')[0].animate([
      { transform: 'scale(0.8)' },
      { transform: 'scale(1)' },
    ], 50);

    this._super(...arguments);
  },
});
