import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
    deferredPrompt: null,

    isStandaloneMode: computed(function() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true
        );
    }),

    addListeners() {
        if (!this.isStandaloneMode) {
            window.addEventListener('beforeinstallprompt', e => {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Stash the event so it can be triggered later.
                this.set('deferredPrompt', e);
            });
        }
    },

    showPrompt() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then(() => this.set('deferredPrompt', null));
        }
    },
});
