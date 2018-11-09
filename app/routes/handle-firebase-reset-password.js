import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({
    init() {
        this._super(...arguments);

        this.ifrm = document.createElement('iframe');
        this.ifrm.setAttribute('id', 'ifrm');
    },

    model() {
        return fetch(window.location.href)
            .then(res => res.text())
            .then(res => {
                this.set('html', res);
                return true;
            });
    },

    activate() {
        schedule('afterRender', () => {
            var el = document.querySelector('.content-wrapper');
            el.appendChild(this.ifrm, el);

            this.ifrm.contentWindow.document.open();
            this.ifrm.contentWindow.document.write(this.html);
            this.ifrm.contentWindow.document.close();
        });
    },
});
