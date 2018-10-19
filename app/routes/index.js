import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    settings: service(),
    myGroup: service('my-group'),

    settingsModel: computed.alias('settings.model'),

    model() {
        if (!this.get('myGroup.groupName')) return {};

        return this.myGroup.fetch().then(group =>
            hash({
                me: this.me.fetch(),
                users: group.get('users'),
                cheevies: group.get('cheevies'),
                settings: this.settings.fetch(),
            })
        );
    },

    afterModel() {
        const imageSets = this.store.peekAll('image-set');

        later(() => {
            imageSets.forEach(_is =>
                _is.eachRelationship(key => requestAnimationFrame(() => _is.get(key)))
            );
        }, 1000);
    },
});
