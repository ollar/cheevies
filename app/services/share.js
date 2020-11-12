import Service from '@ember/service';
import { getOwner } from '@ember/application';

export default class ShareService extends Service {
    get isAvailable() {
        return Boolean(navigator.share);
    }

    emailFallBack({ title, text, url }) {
        url = typeof url === 'undefined' ? this.appDomain : url;

        return new Promise(() => {
            const sharer = window.open(
                `mailto:newuser@here.com?subject=${title}&body=${text} ==> ${url}`
            );
            return sharer;
        });
    }

    get appDomain() {
        const owner = getOwner(this);
        return owner.application.appDomain || `${window.location.origin}`;
    }

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
    }
}
