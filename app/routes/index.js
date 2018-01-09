import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from '../utils/animation-middleware';

export default Route.extend({
  model() {
    return RSVP.hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },

  activate() {
    this.set('am', new Middleware());
    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');

      this.get('am').use((next) => {
        $($iconImages).css({transform: 'scale(0.5)', opacity: 0});

        next();
      });

      this.get('am').use((next) => {
        function animate(elems) {
          var _elems = Array.prototype.slice.call(elems);
          var anim = _elems[0].animate([
            {transform: 'scale(0.5)', opacity: 0},
            {transform: 'scale(1)', opacity: 1},
          ], {
            duration: 24,
            fill: 'forwards',
          });

          if (_elems.length > 1) {
            anim.onfinish = () => animate(_elems.slice(1));
          } else {
            anim.onfinish = next;
          }
        }

        animate($iconImages);
      });

      schedule('afterRender', () => {
        this.get('am').go(() => console.log('complete'));
      });
    });
  }
});
