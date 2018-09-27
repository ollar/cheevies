import Mixin from '@ember/object/mixin';
import Hammer from 'hammerjs';
import { htmlSafe } from '@ember/string';

const {
    DIRECTION_ALL,
    DIRECTION_NONE,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL,
} = Hammer;

export default Mixin.create({
    classNameBindings: ['dragged:is-dragged'],
    attributeBindings: ['style'],

    dragged: false,
    style: htmlSafe(''),
    cachedStyle: htmlSafe(''),
    initialTransform: [0, 0],

    DIRECTION_ALL: DIRECTION_ALL,
    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,

    panDirection() {
        return this.DIRECTION_ALL;
    },
    maxDistance: 1000,

    init() {
        this._super(...arguments);

        this.handlePanStart = this.handlePanStart.bind(this);
        this.handlePanEnd = this.handlePanEnd.bind(this);
        this.handlePanMove = this.handlePanMove.bind(this);
    },

    onPanEnvComplete() {
        this.set('style', htmlSafe(`${this.cachedStyle}`));
    },

    handlePanStart(ev) {
        this.set('dragged', true);
        ev.preventDefault();
        const { transform } = window.getComputedStyle(this.element);

        this.set(
            'initialTransform',
            transform
                .replace(/[a-z()]/g, '')
                .split(', ')
                .slice(-2)
                .map(i => Number(i))
        );
        this.set('cachedStyle', this.element.getAttribute('style'));
        this.set('previousMoveX', this.initialTransform[0]);
        this.set('previousMoveY', this.initialTransform[1]);
    },

    calcDelta(delta) {
        return Math.sign(delta) * Math.min(Math.abs(delta), this.maxDistance);
    },

    handlePanMove(ev) {
        ev.preventDefault();

        const moveX =
            (ev.direction & this.panDirection()) === ev.direction
                ? this.initialTransform[0] + this.calcDelta(ev.deltaX)
                : this.previousMoveX;
        const moveY =
            (ev.direction & this.panDirection()) === ev.direction
                ? this.initialTransform[1] + this.calcDelta(ev.deltaY)
                : this.previousMoveY;

        this.set(
            'style',
            htmlSafe(
                `${this.cachedStyle};
                transform: translate(
                    ${
                        (this.panDirection() | this.DIRECTION_HORIZONTAL) === this.panDirection()
                            ? moveX
                            : this.previousMoveX
                    }px,
                    ${
                        (this.panDirection() | this.DIRECTION_VERTICAL) === this.panDirection()
                            ? moveY
                            : this.previousMoveY
                    }px
                )`
            )
        );

        this.set('previousMoveX', moveX);
        this.set('previousMoveY', moveY);
    },

    handlePanEnd(ev) {
        this.set('dragged', false);
        ev.preventDefault();
        ev.srcEvent.stopPropagation();

        this.onPanEnvComplete();
    },

    didInsertElement() {
        this._super(...arguments);

        this.hammerManager = new Hammer.Manager(this.element);

        this.hammerManager.add(
            new Hammer.Pan({
                direction: this.panDirection(),
                threshold: 0,
            })
        );

        this.hammerManager.on('panstart', this.handlePanStart);
        this.hammerManager.on('panend', this.handlePanEnd);
        this.hammerManager.on('pan', this.handlePanMove);
    },

    willDestroyElement() {
        this._super(...arguments);
        this.hammerManager.destroy();
    },
});
