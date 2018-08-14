import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

import Middleware from 'web-animation-middleware';

export default Route.extend({
  activate() {
    const am = new Middleware();
    schedule('afterRender', () => {
      var $header = document.querySelector('header');
      // var $main = document.querySelector('main');
      var $iconImage = document.querySelector('.user-image');
      var $title = document.querySelector('.title');
      var $cheevies = document.querySelectorAll('.cheevie-wrapper');

      if ($header) {
        var headerHeight = $header.offsetHeight;
        window.scrollTo(0, headerHeight);
      }

      am.prepare($iconImage, { transform: 'scale(1.2)' });
      am.prepare($title, { opacity: 0 });
      am.prepare($cheevies, { transform: 'scale(0)', opacity: 0 });

      am.step(
        $iconImage,
        [
          {
            transform: 'scale(1.2)',
            opacity: 0.3,
          },
          {
            transform: 'scale(1)',
            opacity: 1,
          },
        ],
        {
          duration: 100,
          fill: 'forwards',
        }
      );

      am.step(
        $title,
        { opacity: [0, 1] },
        {
          duration: 100,
          fill: 'forwards',
        }
      );

      am.chain(
        $cheevies,
        [
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 24,
          fill: 'forwards',
        }
      );

      schedule('afterRender', () => {
        // am.go(() => {
        //   $main.classList.add('animation-finished');
        // });
      });
    });
  },

  userHasEnteredData() {
    return (
      Object.keys(this.get('controller.model').changedAttributes()).length > 0
    );
  },

  actions: {
    willTransition() {
      if (this.userHasEnteredData()) {
        this.get('controller.model').save();
      }
      return true;
    },
  },
});
