import Service from '@ember/service';

export default Service.extend({
  orientation: {},
  motion: {},

  init() {
    this._super();
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
    window.addEventListener('devicemotion', this.handleMotion.bind(this), true);
  },

  handleOrientation(e) {
    this.set('orientation', {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  },

  handleMotion(e) {
    this.set('motion', {
      acceleration: e.acceleration,
      accelerationIncludingGravity: e.accelerationIncludingGravity,
      rotationRate: e.rotationRate,
    });
  }
});
