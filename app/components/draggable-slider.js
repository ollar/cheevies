import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';
import { throttle } from '@ember/runloop';

export default Component.extend(DraggableMixin, {
    tagName: 'ul',

    activeSlide: 0,
    slidesNumber: 0,

    init() {
        this._super(...arguments);
        this._setSliderWidth = this._setSliderWidth.bind(this);
        this._trottled = throttle(this, this._setSliderWidth, 100);
    },

    panDirection() {
        return this.DIRECTION_HORIZONTAL;
    },

    _setSliderWidth() {
        if (this.element)
            this.element.style.setProperty(
                '--computedWidth',
                `${this.slidesNumber * this.elementWrapper.offsetWidth}px`
            );
    },

    didInsertElement() {
        this._super();

        this.elementWrapper = this.element.parentNode;

        this.set('slidesNumber', this.element.querySelectorAll('li').length);
        this._setSliderWidth();

        window.addEventListener('resize', this._setSliderWidth);
    },

    willDestroyElement() {
        window.removeEventListener('resize', this._setSliderWidth);
    },
});
