/**
 * this service is wip now
 * used to precache images
 * some parts could be rewritten
 */

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

        this.worker.onmessage = ({ data }) => {
            const { filePath, base64data } = data;
            this.handleWorkerMessage({ filePath, base64data });
        };
    },

    appName: computed(function() {
        return getWithDefault(getOwner(this), 'application.name', '');
    }),

    getCachedSrc(_src) {
        if (!_src) return;
        const filePath = `${this.appName}::${_src}`;

        // check if image is cached and return cache if true
        // if (this.caches[filePath]) return this.caches[filePath];

        this.worker.postMessage({ _src, filePath });
        return _src;
    },

    handleWorkerMessage() {},

    destroy() {
        URL.revokeObjectURL(this.worker);
        this._super(...arguments);
    },
});
