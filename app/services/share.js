import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
    i18n: service(),

    isAvailable: computed(function() {
        return Boolean(navigator.share);
    }),

    init() {
        this._super(...arguments);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess() {
        return this.send('notify', {
            type: 'success',
            text: this.i18n.t('share.messages.success'),
        });
    },

    onError() {
        return this.send('notify', {
            type: 'error',
            text: this.i18n.t('share.messages.error'),
        });
    },

    post({ title, text, url = window.location.href }) {
        return navigator
            .share({
                title,
                text,
                url,
            })
            .then(this.onSuccess, this.onError);
    },
});
