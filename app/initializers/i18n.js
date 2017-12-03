export function initialize(application) {
  application.inject('controller', 'i18n', 'service:i18n');
}

export default {
  name: 'i18n',
  after: 'ember-i18n',
  initialize
};
