import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    notify: service(),
    installStandalone: service('install-standalone'),

    init() {
        this._super(...arguments);
        this.notificationTypes = ['info', 'success', 'warning', 'error'];
        this.installStandalone.addListeners();
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
