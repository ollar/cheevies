import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';
import { throttle } from '@ember/runloop';
import { htmlSafe } from '@ember/string';

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
        if (this.element) {
            this.set('slideWidth', this.elementWrapper.offsetWidth);
            this.element.style.setProperty(
                '--computedWidth',
                `${this.slidesNumber * this.slideWidth}px`
            );
        }
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

    onPanEnvComplete() {
        const transformX = this.initialTransform[0];
        const moveX = transformX - this.previousMoveX;

        if (Math.abs(moveX) > 100) {
            if (moveX > 0) {
                if (this.activeSlide < this.slidesNumber - 1) this.incrementProperty('activeSlide');
            } else {
                if (this.activeSlide > 0) this.decrementProperty('activeSlide');
            }
        }

        this.set(
            'style',
            htmlSafe(
                `${this.cachedStyle} transform: translate(${-this.activeSlide *
                    this.slideWidth}px, 0)`
            )
        );
    },
});
