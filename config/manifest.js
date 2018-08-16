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
    display: 'fullscreen',
    background_color: '#1D2349',
    theme_color: '#1D2349',
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
    ],
  };
};
