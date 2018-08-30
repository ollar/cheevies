import Mixin from '@ember/object/mixin';
import Hammer from 'hammerjs';

export default Mixin.create({
  classNameBindings: ['dragged:is-dragged'],

  dragged: false,

  init() {
    this._super(...arguments);

    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handlePanMove = this.handlePanMove.bind(this);
  },

  handlePanStart(ev) {
    this.set('dragged', true);
    ev.preventDefault();
    this.element.style.left = ev.center.x + 'px';
    this.element.style.top = ev.center.y + 'px';
  },

  handlePanEnd(ev) {
    this.set('dragged', false);
    ev.preventDefault();
    this.element.style.left = '';
    this.element.style.top = '';
  },

  handlePanMove(ev) {
    ev.preventDefault();
    this.element.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
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
