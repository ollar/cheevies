import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({
  cheevies: [],
  afterModel() {
    return this.get('store').findAll('cheevie').then(res => this.set('cheevies', res));
  },

  activate() {
    schedule('afterRender', () => {
      var $header = document.querySelector('header');
      var $iconImage = document.querySelector('.icon-image');
      var $title = document.querySelector('.title');
      var $cheevies = document.querySelectorAll('.cheevie-wrapper');

      if ($header) {
        var headerHeight = $header.offsetHeight;
        window.scrollTo(0, headerHeight);
      }

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
      }).onfinish = () => {
        $title.animate(
          { opacity: [0,1] },
          {
            duration: 100,
            fill: 'forwards',
          }
        ).onfinish = () => {
          function animate(elems) {
            var _elems = Array.prototype.slice.call(elems);
            var anim = _elems[0].animate([
              {transform: 'scale(0)', opacity: 0},
              {transform: 'scale(1)', opacity: 1},
            ], {
              duration: 24,
              fill: 'forwards',
            });

            if (_elems.length > 1)
              anim.onfinish = () => animate(_elems.slice(1));
          }

          animate($cheevies);
        }
      }
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
