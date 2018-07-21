import AuthenticatedRouteMixinMixin from 'cheevies-jerk/mixins/authenticated-route-mixin';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Route from '@ember/routing/route';
import Service from '@ember/service';
import { resolve } from 'rsvp';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
  isAuthenticated: true,
  data: computed(() => ({ authenticated: {} })),
});

const transition = {
  intent: {
    url: '/index',
  },
  send() {},
};

const MixinImplementingBeforeModel = Mixin.create({
  beforeModel() {
    return resolve('upstreamReturnValue');
  },
});

module('Unit | Mixin | authenticated-route-mixin', function(hooks) {
  let route;

  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
    const TestRoute = Route.extend(
      MixinImplementingBeforeModel,
      AuthenticatedRouteMixinMixin,
      {
        transitionTo(routeName) {
          return routeName;
        },
      }
    );

    this.owner.register('route:test', TestRoute);
  });

  test('session is authenticated', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner
      .lookup('service:session')
      .set('data.authenticated.group', 'true');

    route = this.owner.lookup('route:test');

    route
      .beforeModel(transition)
      .then(res => assert.equal(res, 'upstreamReturnValue'));
  });

  test('session is not authenticated', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', false);
    this.owner
      .lookup('service:session')
      .set('data.authenticated.group', 'true');

    route = this.owner.lookup('route:test');

    assert.notOk(route.beforeModel(transition));
  });

  test('session is authenticated but no group', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    route = this.owner.lookup('route:test');
    assert.notOk(route.beforeModel(transition));
  });
});
