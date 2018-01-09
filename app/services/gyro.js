import Service from '@ember/service';

export default Service.extend({
  orientation: {},

  init() {
    this._super();
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
  },

  handleOrientation(e) {
    this.set('orientation', {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }
});
