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
            enabled: false,
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

    app.import('node_modules/normalize.css/normalize.css');
    app.import('node_modules/feather-icons/dist/feather-sprite.svg');

    app.import('node_modules/web-animation-middleware/dist/bundle.iife.js');
    app.import('vendor/shims/web-animation-middleware.js');

    app.import('node_modules/popper.js/dist/umd/popper.min.js');
    app.import('vendor/shims/popper.js');

    app.import('node_modules/particles.js/particles.js');
    app.import('vendor/shims/particles.js');

    return app.toTree();
};
