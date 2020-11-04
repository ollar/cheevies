import EmberRouter from '@ember/routing/router';
import config from 'cheevies/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
    this.route('profile', { path: '/profile/:user_id' }, function() {
        this.route('give-cheevie');
    });

    this.route('index', { path: '/' }, function() {
        this.route('create-cheevie');
        this.route('create-badge');
        this.route('cheevie-details', { path: '/cheevie/:cheevie_id' });
        this.route('new-cheevies');
        this.route('guide');
    });
    this.route('settings');
    this.route('activity');
    this.route('reset-password', { path: '/oh-oh-reset-password' });
    this.route('create-group');
    this.route('join-group', { path: '/join/:group_id' });

    this.route('wardrobe', function() {
        this.route('select-group');
        this.route('sign-in');
        this.route('sign-up');
        this.route('sign-out');
        // this.route('social-sign-in');
    });
    this.route('terms-and-conditions');
    this.route('welcome');
});
