import Mixin from '@ember/object/mixin';
import Hammer from 'hammerjs';

export default Mixin.create({
  init() {
    this._super(...arguments);
  },

  didInsertElement() {
    this.hammer = new Hammer(this.element, { domEvents: true });

    this.hammer.on('pan', function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      // console.log(ev);
    });
  },
});
