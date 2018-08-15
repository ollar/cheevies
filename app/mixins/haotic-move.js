import Mixin from '@ember/object/mixin';
import { schedule } from '@ember/runloop';

const max = 10;
const min = -10;

export default Mixin.create({
  _getMove() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  didInsertElement() {
    this._super();
    const x = this._getMove();
    const y = this._getMove();

    schedule('afterRender', () => {
      this.element.style.transform = `translate(${x}px, ${y}px)`;
    });
  },
});
