import Mixin from '@ember/object/mixin';
import Hammer from 'hammerjs';
import { htmlSafe } from '@ember/string';

export default Mixin.create({
  classNameBindings: ['dragged:is-dragged'],
  attributeBindings: ['style', 'lang'],

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

    this.set('cachedStyle', this.element.getAttribute('style'));

    this.set(
      'style',
      htmlSafe(`${this.cachedStyle};
        left: ${ev.center.x}px;
        top: ${ev.center.y}px;
      `)
    );
  },

  handlePanEnd(ev) {
    this.set('dragged', false);
    ev.preventDefault();
    ev.srcEvent.stopPropagation();

    this.set('cachedStyle', htmlSafe(''));
    this.set('style', htmlSafe(''));
  },

  handlePanMove(ev) {
    ev.preventDefault();

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

    this.hammerManager = new Hammer.Manager(this.element, { domEvents: true });

    this.hammerManager.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 })
    );

    this.hammerManager.on('panstart', this.handlePanStart);
    this.hammerManager.on('panend', this.handlePanEnd);
    this.hammerManager.on('pan', this.handlePanMove);
  },
});
