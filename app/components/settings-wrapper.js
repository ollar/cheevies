import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    settings: service(),
    classNameBindings: ['iconsDescription:icons-description-visible:icons-description-hidden'],

    iconsDescription: readOnly('settings.model.iconsDescription'),
});
