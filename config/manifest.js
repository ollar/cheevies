/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "Cheevies",
    short_name: "Cheevies",
    description: "An app for collecting cheevies for fun",
    start_url: "/",
    lang: 'ru',
    display: "fullscreen",
    background_color: "#fff",
    theme_color: "#fff",
    "gcm_sender_id": "103953800507",
    "icons": [
      {
        "src": "manifest_icons/icon_48.png",
        "sizes": "48x48",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_168.png",
        "sizes": "168x168",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "manifest_icons/icon_512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
    ],
  };
}
