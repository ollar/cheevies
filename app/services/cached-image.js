import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { getWithDefault, computed } from '@ember/object';

export default Service.extend({
    init() {
        this._super(...arguments);
        const blob = new Blob(
            [
                '(',
                function() {
                    self.onmessage = function({ data }) {
                        const { _src, filePath } = data;
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = function() {
                            var blob = xhr.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function() {
                                var base64data = reader.result;
                                self.postMessage({ filePath, base64data });
                            };
                        };
                        xhr.open('GET', _src);
                        xhr.send();
                    };
                }.toString(),
                ')()',
            ],
            {
                type: 'application/javascript',
            }
        );
        const blobUrl = URL.createObjectURL(blob);
        this.worker = new Worker(blobUrl);

        this.worker.onmessage = function({ data }) {
            const { filePath, base64data } = data;
            localStorage.setItem(filePath, base64data);
        };
    },

    appName: computed(function() {
        return getWithDefault(getOwner(this), 'application.name', '');
    }),

    getCachedSrc(_src) {
        if (!_src) return;
        const filePath = `${this.appName}::${_src}`;
        if (localStorage.getItem(filePath)) return localStorage.getItem(filePath);
        this.worker.postMessage({ _src, filePath });
        return _src;
    },

    destroy() {
        URL.revokeObjectURL(this.worker);
        this._super(...arguments);
    },
});
