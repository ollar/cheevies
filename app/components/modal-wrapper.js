import Component from '@ember/component';
import BusyMixin from '../mixins/busy-loader';
import { later } from '@ember/runloop';

export default Component.extend(BusyMixin, {
    classNames: ['modal'],
    classNameBindings: ['isActive:is-active'],

    isActive: false,

    didInsertElement() {
        this._super(...arguments);

        later(() => this.set('isActive', true), 100);
    },

    actions: {
        goBack() {
            this.set('isActive', false);
            later(() => {
                if (this.goBack && this.goBack.call) this.goBack();
            }, 300);
        },
    },
});
