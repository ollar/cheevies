/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
    // See https://github.com/san650/ember-web-app#documentation for a list of
    // supported properties

    return {
        name: 'Cheevies',
        short_name: 'Cheevies',
        description: 'An app for collecting cheevies for fun',
        start_url: '/',
        lang: 'en',
        display: 'standalone',
        background_color: '#1D2349',
        theme_color: '#1D2349',
        orientation: 'portrait',
        gcm_sender_id: '103953800507',
        icons: [
            {
                src: 'firefox/firefox-marketplace-512-512.png',
                sizes: '512x512',
            },
            {
                src: 'firefox/firefox-marketplace-128-128.png',
                sizes: '128x128',
            },
            {
                src: 'firefox/firefox-general-256-256.png',
                sizes: '256x256',
            },
            {
                src: 'firefox/firefox-general-128-128.png',
                sizes: '128x128',
            },
            {
                src: 'firefox/firefox-general-90-90.png',
                sizes: '90x90',
            },
            {
                src: 'firefox/firefox-general-64-64.png',
                sizes: '64x64',
            },
            {
                src: 'firefox/firefox-general-48-48.png',
                sizes: '48x48',
            },
            {
                src: 'firefox/firefox-general-32-32.png',
                sizes: '32x32',
            },
            {
                src: 'firefox/firefox-general-16-16.png',
                sizes: '16x16',
            },
            {
                src: 'ios/ios-appicon-1024-1024.png',
                sizes: '1024x1024',
            },
            {
                src: 'ios/ios-appicon-180-180.png',
                sizes: '180x180',
            },
            {
                src: 'ios/ios-appicon-152-152.png',
                sizes: '152x152',
            },
            {
                src: 'ios/ios-appicon-120-120.png',
                sizes: '120x120',
            },
            {
                src: 'ios/ios-appicon-76-76.png',
                sizes: '76x76',
            },
            {
                src: 'ios/ios-launchimage-750-1334.png',
                sizes: '750x1334',
            },
            {
                src: 'ios/ios-launchimage-1334-750.png',
                sizes: '1334x750',
            },
            {
                src: 'ios/ios-launchimage-1242-2208.png',
                sizes: '1242x2208',
            },
            {
                src: 'ios/ios-launchimage-2208-1242.png',
                sizes: '2208x1242',
            },
            {
                src: 'ios/ios-launchimage-640-960.png',
                sizes: '640x960',
            },
            {
                src: 'ios/ios-launchimage-640-1136.png',
                sizes: '640x1136',
            },
            {
                src: 'ios/ios-launchimage-1536-2048.png',
                sizes: '1536x2048',
            },
            {
                src: 'ios/ios-launchimage-2048-1536.png',
                sizes: '2048x1536',
            },
            {
                src: 'ios/ios-launchimage-768-1024.png',
                sizes: '768x1024',
            },
            {
                src: 'ios/ios-launchimage-1024-768.png',
                sizes: '1024x768',
            },
        ],
    };
};
