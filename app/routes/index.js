import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from '../utils/animation-middleware';
import $ from 'jquery';

export default Route.extend({
  model() {
    return RSVP.hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },

  activate() {
    const am = new Middleware();

    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');

      am.prepare(next => {
        $($iconImages).css({ transform: 'scale(0.5)', opacity: 0 });

        next();
      });

      am.chain(
        $iconImages,
        [
          { transform: 'scale(0.5)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 24,
          fill: 'forwards',
        }
      );

      schedule('afterRender', () => {
        am.go(() => true);
      });
    });
  },
});
