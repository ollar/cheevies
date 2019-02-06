import Service from '@ember/service';
import { computed, getWithDefault } from '@ember/object';
import { getOwner } from '@ember/application';

export default Service.extend({
    isAvailable: computed(function() {
        return Boolean(navigator.share);
    }),

    emailFallBack({ title, text, url }) {
        url = typeof url === 'undefined' ? this.appDomain : url;

        return new Promise(() => {
            const sharer = window.open(
                `mailto:newuser@here.com?subject=${title}&body=${text} ==> ${url}`
            );
            return sharer;
        });
    },

    appDomain: computed(function() {
        return getWithDefault(getOwner(this), 'application.appDomain', window.location.href);
    }),

    post({ title, text, url }) {
        url = typeof url === 'undefined' ? this.appDomain : url;

        return new Promise(() => {
            let sharer = this.isAvailable
                ? navigator.share({
                      title: title.toString(),
                      text: text.toString(),
                      url,
                  })
                : this.emailFallBack({ title, text, url });
            return sharer;
        });
    },
});
