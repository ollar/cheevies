(function() {
  function vendorModule() {
    'use strict';

    return {
      default: self['particlesJS'],
      __esModule: true,
    };
  }

  define('particles', [], vendorModule);
})();
