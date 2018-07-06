(function() {
  function vendorModule() {
    'use strict';

    return {
      default: self['Popper'],
      __esModule: true,
    };
  }

  define('popper', [], vendorModule);
})();
