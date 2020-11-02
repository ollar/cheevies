/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const environment = EmberApp.env();
const IS_PROD = environment === 'production';
const IS_TEST = environment === 'test';
const IS_CORDOVA = environment === 'cordova';

module.exports = function(defaults) {
    let app = new EmberApp(defaults, {
        // Add options here
        'ember-service-worker': {
            enabled: IS_PROD,
            versionStrategy: 'every-build',
        },
        'asset-cache': {
            enabled: IS_PROD,
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
        sourcemaps: {
            enabled: !IS_PROD && !IS_CORDOVA,
        },
        'ember-cli-uglify': {
            enabled: IS_PROD || IS_CORDOVA,
        },
        minifyCSS: {
            enabled: IS_PROD || IS_CORDOVA,
        },
    });

    app.import('node_modules/normalize.css/normalize.css');
    app.import('node_modules/feather-icons/dist/feather-sprite.svg');

    // app.import('node_modules/popper.js/dist/umd/popper.min.js');
    // app.import('vendor/shims/popper.js');

    app.import('node_modules/particles.js/particles.js');
    app.import('vendor/shims/particles.js');


    return app.toTree();
};
