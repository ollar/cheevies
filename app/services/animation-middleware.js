import Service from '@ember/service';

export default Service.extend({
  use(func) {
    this.go = (function(_go, _this) {
      return function(next) {
        return _go.call(_this, function() {
          return func.call(_this, next.bind(_this));
        })
      };
    })(this.go, this);
  },

  go(next) {
    return requestAnimationFrame(next);
  },

  reset(next) {
    this.go = next();
  },
});
