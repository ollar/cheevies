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
        hinting: IS_TEST,
        tests: IS_TEST,
        // 'ember-cli-babel': {
        //     includePolyfill: false,
        // },
        sourcemaps: {
            enabled: !IS_PROD && !IS_CORDOVA,
        },
        'ember-cli-uglify': {
            enabled: IS_PROD || IS_CORDOVA,
            exclude: ["**/vendor.js"], // tenser is shit
        },
        minifyCSS: {
            enabled: IS_PROD || IS_CORDOVA,
        },
        fingerprint: {
            extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'json'],
        }
    });

    app.import('node_modules/normalize.css/normalize.css');
    app.import('node_modules/feather-icons/dist/feather-sprite.svg');

    app.import('node_modules/particles.js/particles.js');
    app.import('vendor/shims/particles.js');


    return app.toTree();
};
