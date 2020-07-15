import Component from '@ember/component';
import particlesJS from 'particles';
import config from './particlesjs-config';

export default Component.extend({
    elementId: 'particles-container',
    didInsertElement() {
        particlesJS('particles-container', config);
    },
});
