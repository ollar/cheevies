import Mixin from '@ember/object/mixin';
import Hammer, {
  DIRECTION_ALL,
  DIRECTION_NONE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
} from 'hammerjs';
import { htmlSafe } from '@ember/string';

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
    return Hammer.DIRECTION_ALL;
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
  },

  handlePanMove(ev) {
    ev.preventDefault();

    // this.set(
    //   'style',
    //   htmlSafe(
    //     `${this.cachedStyle}; transform: translate(${this.initialTransform[0] +
    //       ev.deltaX}px, ${this.initialTransform[1] + ev.deltaY}px)`
    //   )
    // );

    this.set(
      'style',
      htmlSafe(
        `${this.cachedStyle};
        transform: translate(
          ${this.initialTransform[0] +
            Math.sign(ev.deltaX) *
              Math.min(Math.abs(ev.deltaX), this.maxDistance)}px,
          ${this.initialTransform[1] +
            Math.sign(ev.deltaY) *
              Math.min(Math.abs(ev.deltaY), this.maxDistance)}px
        )`
      )
    );

    this.set('previousStyle', this.get('style'));
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
    this.hammerManager.on('pan', this.handlePanMove);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.hammerManager.destroy();
  },
});
