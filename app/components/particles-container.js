import Component from '@ember/component';
import particlesJS from 'particles';

export default Component.extend({
    elementId: 'particles-container',
    didInsertElement() {
        particlesJS.load('particles-container', '/particlesjs-config.json');
    },
});
