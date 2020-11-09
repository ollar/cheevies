/* eslint-env node */
'use strict';

require('dotenv').config();

const { awsAccessKey, awsSecurityKey } = process.env;

module.exports = function(deployTarget) {
    let ENV = {
        build: {},
        // include other plugin configuration that applies to all deploy targets here
    };

    if (deployTarget === 'development') {
        ENV.build.environment = 'development';
        // configure other plugins for development deploy target here

        ENV.manifest = {
            fileIgnorePattern: '*',
        };

        ENV.s3 = {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecurityKey,
            bucket: 'cheevies-dev',
            region: 'eu-west-1',
            allowOverwrite: true,
        };

        ENV['s3-index'] = {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecurityKey,
            bucket: 'cheevies-dev',
            region: 'eu-west-1',
            allowOverwrite: true,
        };
    }

    if (deployTarget === 'testing') {
        ENV.build.environment = 'test';
        // configure other plugins for staging deploy target here
    }

    if (deployTarget === 'staging') {
        ENV.build.environment = 'production';
        // configure other plugins for staging deploy target here
    }

    if (deployTarget === 'production') {
        ENV.build.environment = 'production';
        // configure other plugins for production deploy target here

        ENV.s3 = {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecurityKey,
            bucket: 'cheevies',
            region: 'eu-west-1'
        };

        ENV['s3-index'] = {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecurityKey,
            bucket: 'cheevies',
            region: 'eu-west-1'
        };
    }

    // Note: if you need to build some configuration asynchronously, you can return
    // a promise that resolves with the ENV object instead of returning the
    // ENV object synchronously.
    return ENV;
};
