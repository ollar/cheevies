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
        ev.preventDefault();
        this.set('dragged', true);
        this.set('cachedStyle', this.element.getAttribute('style'));
        const { transform } = window.getComputedStyle(this.element);

        if (transform === 'none') {
            this.set('initialTransform', [0, 0]);
        } else {
            this.set(
                'initialTransform',
                transform
                    .replace(/[a-z()]/g, '')
                    .split(', ')
                    .slice(-2)
                    .map(i => Number(i))
            );
        }

        this.set('previousMoveX', this.initialTransform[0]);
        this.set('previousMoveY', this.initialTransform[1]);
    },

    calcDelta(delta) {
        return Math.sign(delta) * Math.min(Math.abs(delta), this.maxDistance);
    },

    handlePanMove(ev) {
        ev.preventDefault();

        const moveX = () =>
            (ev.direction & this.panDirection()) === ev.direction
                ? this.initialTransform[0] + this.calcDelta(ev.deltaX)
                : this.previousMoveX;
        const moveY = () =>
            (ev.direction & this.panDirection()) === ev.direction
                ? this.initialTransform[1] + this.calcDelta(ev.deltaY)
                : this.previousMoveY;

        const allowedHorizontal =
            (this.panDirection() | this.DIRECTION_HORIZONTAL) === this.panDirection();
        const allowedVertical =
            (this.panDirection() | this.DIRECTION_VERTICAL) === this.panDirection();

        this.set(
            'style',
            htmlSafe(
                `${this.cachedStyle};
                transform: translate(
                    ${allowedHorizontal ? moveX() : this.previousMoveX}px,
                    ${allowedVertical ? moveY() : this.previousMoveY}px
                )`
            )
        );

        if (allowedHorizontal) this.set('previousMoveX', moveX());
        if (allowedVertical) this.set('previousMoveY', moveY());
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
            })
        );

        this.hammerManager.on('panstart', this.handlePanStart);
        this.hammerManager.on('panend', this.handlePanEnd);
        this.hammerManager.on('panmove', this.handlePanMove);
        this.hammerManager.on('pancancel', this.handlePanEnd);
    },

    willDestroyElement() {
        this._super(...arguments);
        this.hammerManager.destroy();
    },
});
