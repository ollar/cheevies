import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    myGroup: service('my-group'),

    model() {
        if (!this.get('myGroup.groupName')) return {};

        return this.myGroup.fetch().then(group =>
            hash({
                me: this.me.fetch(),
                users: group.get('users'),
                cheevies: group.get('cheevies'),
            })
        );
    },

    afterModel() {
        const imageSets = this.store.peekAll('image-set');
        imageSets.forEach(_is =>
            _is.eachRelationship(key => requestIdleCallback(() => _is.get(key)))
        );
    },
});
