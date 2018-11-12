import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { getWithDefault, computed } from '@ember/object';

export default Service.extend({
    appName: computed(function() {
        return getWithDefault(getOwner(this), 'application.name', '');
    }),

    getCachedSrc(_src) {
        if (!_src) return;
        const filePath = `${this.appName}::${_src}`;

        if (localStorage.getItem(filePath)) return localStorage.getItem(filePath);

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var blob = xhr.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                var base64data = reader.result;
                localStorage.setItem(filePath, base64data);
            };
        };
        xhr.open('GET', _src);
        xhr.send();

        return _src;
    },
});
