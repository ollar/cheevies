import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from 'avatar-icon-component/components/avatar-icon';
import { isEmpty } from '@ember/utils';

export default Component.extend({
    colours: computed(() => [
        ['#FF0000', '#4838FF'],
        ['#4838FF', '#1D2349'],
        ['#CD04FF', '#BA0064'],
        ['#0075FF', '#FF008A'],
        ['#FF5C00', '#FF0000'],
        ['#FFEC87', '#FF0000'],
    ]),

    classNameBindings: ['power'],

    name: computed('data.name', function() {
        if (isEmpty(this.data)) return '';
        return this.data.get('username') || this.data.get('name') || 'anonymous';
    }),

    power: readOnly('data.power'),

    updateStyles() {
        this.element.style.setProperty('--backgroundColour0', this.backgroundColour[0]);
        this.element.style.setProperty('--backgroundColour1', this.backgroundColour[1]);
    },
});
