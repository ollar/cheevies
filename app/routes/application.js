import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Route.extend({
    notify: service(),
    intl: service(),
    installStandalone: service('install-standalone'),

    init() {
        this._super(...arguments);
        this.notificationTypes = ['info', 'success', 'warning', 'error'];
        this.installStandalone.addListeners();
    },

    beforeModel() {
        return this.intl.setLocale([navigator.language, 'en-us']);
    },
    activate() {
        if (!window.cordova && window.innerWidth > 1000) {
            schedule('afterRender', () =>
                this.send('notify', {
                    type: 'warning',
                    text: this.intl.t('messages.screen_width_warning'),
                })
            );
        }
    },
    actions: {
        notify({ type, text }) {
            if (this.get('notificationTypes').indexOf(type) === -1) {
                throw new Error(text);
            }
            return this.get('notify')[type](text);
        },
    },
});
