import Route from '@ember/routing/route';
import run from '@ember/runloop';

export default Route.extend({
  cheevies: [],
  afterModel() {
    return this.get('store').findAll('cheevie').then(res => this.set('cheevies', res));
  },

  activate() {
    var header = document.querySelector('header');
    if (header) {
      var headerHeight = header.offsetHeight;
      window.scrollTo(0, headerHeight);
    }

    run.later('afterRender', () => {
      console.log('assa')
    })

      var iconImage = document.querySelector('.icon-image');

      if (iconImage) {
        var iconImageAnimation = iconImage.animate([
            {height: 0},
            {height: '100px'},
            {height: 0},
          ], {
            duration: 5000,
            iterations: Infinity,
          });
      }
    }, 1000)

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
