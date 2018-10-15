import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    myGroup: service('my-group'),
    firebaseApp: service(),

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
            _is.eachRelationship(key => requestAnimationFrame(() => _is.get(key)))
        );

        const messaging = this.get('firebaseApp').messaging();
        const _this = this;

        if (this.get('me.model')) {
            messaging
                .requestPermission()
                .then(() => messaging.getToken())
                .then(token => {
                    this.get('me.model').set('fcmToken', token);
                    this.get('me.model').save();
                })
                .catch(err => {
                    this.send('notify', {
                        type: 'error',
                        text: err.toString(),
                    });
                });
        }

        messaging.onMessage(payload => {
            _this.send('notify', {
                type: 'info',
                text: payload.notification.body,
            });
        });
    },
});
