import Component from '@ember/component';
import Middleware from '../utils/animation-middleware';
import { schedule } from '@ember/runloop';

export default Component.extend({
    didInsertElement() {
      this.set('am', new Middleware());

      schedule('afterRender', () => {
        this.get('am').use((next) => {
          this.$().css({
            'transform': 'scale(0)',
          });

          next();
        });

        this.get('am').use((next) => {
          this.element.animate([
            {transform: 'scale(0)', opacity: 0},
            {transform: 'scale(1)', opacity: 1},
          ], {
            duration: 300,
            fill: 'forwards',
          }).onfinish = next;
        });

        this.get('am').go(() => {
          // animation finished
          // this.$().addClass('animation-finished');
        });
      });
    }
});
