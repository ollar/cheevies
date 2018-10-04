import Component from '@ember/component';

export default Component.extend({
    shuffleProps() {
        const $props = this.element.querySelectorAll('svg');
        const height = document.body.scrollHeight;
        const width = document.body.scrollWidth;

        $props.forEach($prop => {
            $prop.style.transform = `translate(${Math.random() * width}px, -${Math.random() *
                height}px)`;
        });
    },

    didInsertElement() {
        this._super(...arguments);

        this.shuffleProps();
    },
});
