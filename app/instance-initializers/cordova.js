import serializeUrlParams from '../utils/serialize-url-params';

export function initialize(appInstance) {
    if (!window.cordova) return;

    document.addEventListener('deviceready', function() {
        if (window.universalLinks) {
            window.universalLinks.subscribe('universalLinksCatched', e => {
                const { path, params } = e;
                const router = appInstance.lookup('service:router');

                router.transitionTo(path + serializeUrlParams(params));
            });
        }
    });
}

export default {
    initialize,
};
