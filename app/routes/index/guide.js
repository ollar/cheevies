import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        willTransition() {
            return window.localStorage.setItem('hideGuidePopup', true);
        },
    },
});
