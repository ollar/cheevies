'use strict';

require("dotenv").config();

const APP_NAME = "cheevies";
const { sentryDsn, giphyApiKey, appDomain } = process.env;

module.exports = function(environment) {
  let ENV = {
    modulePrefix: APP_NAME,
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      apiHost: 'http://34.242.87.146:8080',
      authHost: 'http://34.242.87.146:8090',
      // apiHost: 'http://localhost:8080',
      // authHost: 'http://localhost:8090',
      // authHost: 'http://localhost:8090',
      appName: APP_NAME,
      giphyApiKey,
    },
    '@sentry/ember': {
        sentry: {}
      }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.APP.apiHost = 'https://api.ollar.rocks';
    ENV.APP.authHost = 'https://auth.ollar.rocks';

    ENV['@sentry/ember'] = {
      sentry: {
        dsn: sentryDsn,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
      }
    };
  }

  if (environment === 'cordova') {
      ENV.rootURL = '';
      ENV.locationType = 'hash';
      ENV.APP.apiHost = 'https://api.ollar.rocks';
      ENV.APP.authHost = 'https://auth.ollar.rocks';
      ENV.APP.appDomain = appDomain;

      ENV['@sentry/ember'] = {
        sentry: {
          dsn: sentryDsn,
          tracesSampleRate: 1.0,
        }
      };
  }

  return ENV;
};
