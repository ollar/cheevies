import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
    settings: service(),
    classNameBindings: ['iconsDescription:icons-description-visible:icons-description-hidden'],

    iconsDescription: computed.readOnly('settings.model.iconsDescription'),
});
