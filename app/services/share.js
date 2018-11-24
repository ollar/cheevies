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

    emailFallBack({ title, text, url = window.location.href }) {
        return new Promise(() => {
            const sharer = window.open(
                `mailto:newuser@here.com?subject=${title}&body=${text} ==> ${url}`
            );
            return sharer;
        });
    },

    post({ title, text, url = window.location.href }) {
        return new Promise((res, rej) => {
            let sharer = this.isAvailable
                ? navigator.share({
                      title,
                      text,
                      url,
                  })
                : this.emailFallBack({ title, text, url });
            return sharer.then(res, rej);
        });
    },
});
