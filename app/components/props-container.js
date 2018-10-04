import Component from '@ember/component';
import Middleware from 'web-animation-middleware';

export default Component.extend({
    shuffleProps() {
        const $props = this.element.querySelectorAll('svg');
        const height = document.body.scrollHeight;
        const width = document.body.scrollWidth;

        const am = new Middleware();

        $props.forEach($prop => {
            am.prepare($prop, {
                transform: `translate(${Math.random() * width}px, -${Math.random() * height}px)`,
                opacity: 0,
            });
        });

        am.chain($props, [{ opacity: 0 }, { opacity: 1 }], {
            duration: 300,
            fill: 'forwards',
        });

        am.go(() => true);
    },

    didInsertElement() {
        this._super(...arguments);

        this.shuffleProps();
    },
});
