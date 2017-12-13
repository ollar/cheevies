import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({
  cheevies: [],
  afterModel() {
    return this.get('store').findAll('cheevie').then(res => this.set('cheevies', res));
  },

  activate() {
    schedule('afterRender', () => {
      var header = document.querySelector('header');
      if (header) {
        var headerHeight = header.offsetHeight;
        window.scrollTo(0, headerHeight);
      }

      var iconImage = document.querySelector('.icon-image');
      if (iconImage) {
        var iconImageAnimation = iconImage.animate([
            {
              transform: 'scale(1.2)',
              opacity: 0.3,
            },
            {
              transform: 'scale(1)',
              opacity: 1,
            },
          ], {
            duration: 300,
          });
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
