import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

import Middleware from '../utils/animation-middleware';

export default Route.extend({
  cheevies: [],
  afterModel() {
    return this.get('store').findAll('cheevie').then(res => this.set('cheevies', res));
  },

  activate() {
    this.set('am', new Middleware());
    schedule('afterRender', () => {
      var $header = document.querySelector('header');
      var $main = document.querySelector('main');
      var $iconImage = document.querySelector('.user-image');
      var $title = document.querySelector('.title');
      var $cheevies = document.querySelectorAll('.cheevie-wrapper');

      if ($header) {
        var headerHeight = $header.offsetHeight;
        window.scrollTo(0, headerHeight);
      }

      this.get('am').use((next) => {
        $($iconImage).css({transform: 'scale(1.2)'});
        $($title).css({opacity: 0});
        $($cheevies).css({transform: 'scale(0)', opacity: 0});

        next();
      });

      this.get('am').use((next) => {
        $iconImage.animate([
          {
            transform: 'scale(1.2)',
            opacity: 0.3,
          },
          {
            transform: 'scale(1)',
            opacity: 1,
          },
        ], {
          duration: 100,
          fill: 'forwards',
        }).onfinish = next;
      });

      this.get('am').use((next) => {
        $title.animate(
          { opacity: [0,1] },
          {
            duration: 100,
            fill: 'forwards',
          }
        ).onfinish = next;
      });

      this.get('am').use((next) => {
        function animate(elems) {
          var _elems = Array.prototype.slice.call(elems);
          var anim = _elems[0].animate([
            {transform: 'scale(0)', opacity: 0},
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

        animate($cheevies);
      });

      schedule('afterRender', () => {
        this.get('am').go(() => {
          $main.classList.add('animation-finished');
        });
      });
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('cheevies', this.get('cheevies'))
  },

  userHasEnteredData() {
    return Object.keys(this.get('controller.model').changedAttributes()).length > 0;
  },

  actions: {
    willTransition() {
      if (this.userHasEnteredData()) {
        this.get('controller.model').save();
      }
      return true;
    }
  }
});
