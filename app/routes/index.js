import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from 'web-animation-middleware';

export default Route.extend({
  model() {
    return hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },

  activate() {
    const am = new Middleware();
    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');
      am.prepare($iconImages, { transform: 'scale(0.5)', opacity: 0 });

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
