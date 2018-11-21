import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    activePage: 'users',

    myGroup: service(),

    users: computed('model.users.[]', function() {
        return this.model.users.filter(user => user.id !== this.model.me.id);
    }),

    cheevies: computed.readOnly('myGroup.cheevies'),

    actions: {
        openDrawer() {
            this.send('toggleDrawer');
        },
        setActivePage(type) {
            this.set('activePage', type);
        },
    },
});
