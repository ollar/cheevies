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
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
    ]
  };
}
