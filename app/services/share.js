import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
    isAvailable: computed(function() {
        return Boolean(navigator.share);
    }),

    emailFallBack({ title, text, url = window.location.href }) {
        return new Promise(() => {
            const sharer = window.open(
                `mailto:newuser@here.com?subject=${title}&body=${text} ==> ${url}`
            );
            return sharer;
        });
    },

    post({ title, text, url = window.location.href }) {
        return new Promise(() => {
            let sharer = this.isAvailable
                ? navigator.share({
                      title,
                      text,
                      url,
                  })
                : this.emailFallBack({ title, text, url });
            return sharer;
        });
    },
});
