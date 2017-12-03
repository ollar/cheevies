import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('register');
  this.route('login');
  this.route('profile', { path: '/profile/:user_id' });

  this.route('index', {path: '/'}, function() {
    this.route('create-cheevie');
    this.route('create-badge');
  });
});

export default Router;
