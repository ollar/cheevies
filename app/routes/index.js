import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
// import { later } from '@ember/runloop';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    settings: service(),
    myGroup: service('my-group'),
    cachedImage: service(),
    intl: service(),

    settingsModel: computed.alias('settings.model'),
    authenticationRoute: 'wardrobe.social-sign-in',

    model() {
        if (!this.get('myGroup.groupName')) return {};

        return this.myGroup
            .fetch()
            .then(group =>
                hash({
                    me: this.me.fetch(),
                    users: group.get('users'),
                    settings: this.settings.fetch(),
                })
            )
            .catch(e => this.onModelError(e));
    },

    onModelError() {
        this.transitionTo('wardrobe.sign-out');
        this.send('notify', {
            type: 'error',
            text: this.intl.t('messages.app_init_error'),
        });
    },

    afterModel() {
        // const imageSets = this.store.peekAll('image-set');

        if (this.me.model) {
            hash({
                myGroup: this.myGroup.fetch(),
                me: this.me.fetch(),
            })
                .then(({ me }) => ({
                    availableCheevies: this.myGroup.cheevies,
                    unseenCheevies: me.get('unseenCheevies'),
                }))
                .then(({ availableCheevies, unseenCheevies }) =>
                    unseenCheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                )
                .then(unseenCheevies => {
                    if (unseenCheevies.length) this.transitionTo('index.new-cheevies');
                });
        }

        // later(
        //     () =>
        //     imageSets.forEach(imageSet =>
        //         imageSet.eachRelationship(key =>
        //             imageSet
        //             .get(key)
        //             .then(imageModel => this.cachedImage.getCachedSrc(imageModel.url))
        //         )
        //     ),
        //     3000
        // );
    },
});
