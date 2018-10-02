import Component from '@ember/component';
import BusyMixin from '../mixins/busy-loader';

export default Component.extend(BusyMixin, {
    classNames: ['modal'],
    didInsertElement() {
        this._super(...arguments);
        this.element.classList.add('is-active');
    },
});
