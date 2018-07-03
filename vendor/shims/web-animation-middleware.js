(function() {
  function vendorModule() {
    'use strict';

    return {
      default: self['WAM'],
      __esModule: true,
    };
  }

  define('web-animation-middleware', [], vendorModule);
})();
