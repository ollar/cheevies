import Mixin from '@ember/object/mixin';
import Hammer from 'hammerjs';
import { htmlSafe } from '@ember/string';

export default Mixin.create({
  classNameBindings: ['dragged:is-dragged'],
  attributeBindings: ['style'],

  dragged: false,
  style: htmlSafe(''),
  cachedStyle: htmlSafe(''),

  init() {
    this._super(...arguments);

    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handlePanMove = this.handlePanMove.bind(this);
  },

  handlePanStart(ev) {
    this.set('dragged', true);
    ev.preventDefault();
    // console.log(window.getComputedStyle(this.element).transform);
    // console.log(window.getComputedStyle(this.element));

    this.set('cachedStyle', this.element.getAttribute('style'));

    // console.log(ev.deltaX, ev.deltaY);
  },

  handlePanEnd(ev) {
    this.set('dragged', false);
    ev.preventDefault();
    ev.srcEvent.stopPropagation();

    this.set('style', htmlSafe(`${this.cachedStyle}`));
    this.set('cachedStyle', htmlSafe(''));
  },

  handlePanMove(ev) {
    ev.preventDefault();

    // console.log(ev);

    this.set(
      'style',
      htmlSafe(
        `${this.cachedStyle}; transform: translate(${ev.deltaX}px, ${
          ev.deltaY
        }px)`
      )
    );
  },

  didInsertElement() {
    this._super(...arguments);

    this.hammerManager = new Hammer.Manager(this.element);

    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL }));

    this.hammerManager.on('panstart', this.handlePanStart);
    this.hammerManager.on('panend', this.handlePanEnd);
    this.hammerManager.on('pan', this.handlePanMove);
  },
});
