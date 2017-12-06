import Route from '@ember/routing/route';

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
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('cheevies', this.get('cheevies'))
  }
});
