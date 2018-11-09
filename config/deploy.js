/* eslint-env node */
'use strict';

require('dotenv').config();

const { deployToken } = process.env;

module.exports = function(deployTarget) {
    let ENV = {
        build: {},
        firebase: {
            deployToken,
            appName: 'default',
            // deployToken: process.env.FIREBASE_TOKEN (if .env stuff is your style)
        },
        // include other plugin configuration that applies to all deploy targets here
    };

    if (deployTarget === 'development') {
        ENV.build.environment = 'development';
        // configure other plugins for development deploy target here

        ENV.firebase.appName = 'dev';
    }

    if (deployTarget === 'testing') {
        ENV.build.environment = 'test';
        // configure other plugins for staging deploy target here

        ENV.firebase.appName = 'test';
    }

    if (deployTarget === 'staging') {
        ENV.build.environment = 'production';
        // configure other plugins for staging deploy target here
    }

    if (deployTarget === 'production') {
        ENV.build.environment = 'production';
        // configure other plugins for production deploy target here
    }

    // Note: if you need to build some configuration asynchronously, you can return
    // a promise that resolves with the ENV object instead of returning the
    // ENV object synchronously.
    return ENV;
};
