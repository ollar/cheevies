var Middleware = function() {};

Middleware.prototype.use = function(fn) {
    var self = this;

    this.go = (function(stack) {
        return function(next) {
            stack.call(self, function() {
                fn.call(self, next.bind(self));
            });
        }.bind(this);
    })(this.go);
};

Middleware.prototype.go = function(next) {
    next();
};

export default Middleware;
