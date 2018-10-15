import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
});

Router.map(function() {
  this.route('register');
  this.route('login');
  this.route('profile', { path: '/profile/:user_id' }, function() {
      this.route('give-cheevie');
  });

  this.route('index', { path: '/' }, function() {
      this.route('create-cheevie');
      this.route('create-badge');
      this.route('cheevie-details', { path: '/cheevie/:cheevie_id' });
      this.route('new-cheevies');
  });
  this.route('logout');
  this.route('settings');
  this.route('activity');
});

export default Router;
