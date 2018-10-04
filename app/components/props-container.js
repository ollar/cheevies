import Component from '@ember/component';
import { schedule, run } from '@ember/runloop';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        const $props = this.element.querySelectorAll('svg');

        schedule('afterRender', () => {
            $props.forEach($prop => {
                requestAnimationFrame(() => {
                    $prop.style.transform = `translate(${Date.now() % 500}px, -${Date.now() %
                        500}px)`;
                });
            });
        });
    },
});
