var Middleware = function() {};

Middleware.prototype.use = function(func) {
  this.go = (function(_go, _this) {
    return function(next) {
      return _go.call(_this, function() {
        return func.call(_this, next.bind(_this));
      })
    };
  })(this.go, this);
}

Middleware.prototype.go = function(next) {
  return requestAnimationFrame(next);
};

export default Middleware;
