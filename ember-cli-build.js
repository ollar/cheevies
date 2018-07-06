/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const environment = EmberApp.env();
const IS_PROD = environment === 'production';
const IS_TEST = environment === 'test';

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-critical': {
      enabled: IS_PROD,
    },
    'ember-service-worker': {
      enabled: IS_PROD,
      versionStrategy: 'every-build',
    },
    'esw-cache-first': {
      patterns: ['https://firebasestorage.googleapis.com/(.+)'],
    },
    'asset-cache': {
      include: ['assets/**/*', 'images/**/*'],
    },

    hinting: IS_TEST,
    tests: IS_TEST,
    'ember-cli-babel': {
      includePolyfill: IS_PROD,
    },
    autoprefixer: {
      sourcemap: false, // Was never helpful
    },
  });

  app.import('node_modules/bulma/css/bulma.css');

  app.import('node_modules/web-animation-middleware/dist/bundle.iife.js');
  app.import('vendor/shims/web-animation-middleware.js');

  app.import('node_modules/popper.js/dist/umd/popper.min.js');
  app.import('vendor/shims/popper.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
