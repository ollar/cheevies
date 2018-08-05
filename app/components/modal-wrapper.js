import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal'],
  didInsertElement() {
    this._super(...arguments);

    this.element.classList.add('is-active');
  },
});
