/* eslint-env node */
'use strict';
require('dotenv').config();

const {
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
    projectId,
    messagingSenderId,

    apiKeyDev,
    authDomainDev,
    databaseURLDev,
    storageBucketDev,
    projectIdDev,
    messagingSenderIdDev,

    apiKeyTest,
    authDomainTest,
    databaseURLTest,
    storageBucketTest,
    projectIdTest,
    messagingSenderIdTest,
} = process.env;

module.exports = function(environment) {
    let ENV = {
        modulePrefix: 'cheevies-jerk',
        environment,
        rootURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false,
            },
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },

        firebase: {
            apiKey,
            authDomain,
            databaseURL,
            projectId,
            storageBucket,
            messagingSenderId,
        },
        torii: {
            sessionServiceName: 'session',
        },
        i18n: {
            defaultLocale: 'en',
        },
        // 'ember-gsap': {
        //     core: ['TweenLite', 'TimelineLite', 'CSSPlugin', 'AttrPlugin', 'easing'],
        // },
    };

    if (environment === 'development') {
        ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        ENV.APP.LOG_VIEW_LOOKUPS = true;

        ENV.firebase = {
            apiKey: apiKeyDev,
            authDomain: authDomainDev,
            databaseURL: databaseURLDev,
            storageBucket: storageBucketDev,
            projectId: projectIdDev,
            messagingSenderId: messagingSenderIdDev,
        };
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;

        ENV.firebase = {
            apiKey: apiKeyTest,
            authDomain: authDomainTest,
            databaseURL: databaseURLTest,
            storageBucket: storageBucketTest,
            projectId: projectIdTest,
            messagingSenderId: messagingSenderIdTest,
        };
    }

    if (environment === 'production') {
        // here you can enable a production-specific feature
    }

    return ENV;
};
