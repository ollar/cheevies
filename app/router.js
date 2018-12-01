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
  this.route('reset-password', { path: '/oh-oh-reset-password' });
  this.route('handle-firebase-reset-password', { path: '/__/auth/action' });
  this.route('create-group');
  this.route('join-group', { path: '/join/:group_id' });
  this.route('login-social');
});

export default Router;
