import UnauthenticatedRouteMixinMixin from 'cheevies-jerk/mixins/unauthenticated-route-mixin';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { resolve } from 'rsvp';
import Route from '@ember/routing/route';
import Mixin from '@ember/object/mixin';
import Service from '@ember/service';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
  isAuthenticated: false,
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

module('Unit | Mixin | unauthenticated-route-mixin', function(hooks) {
  let route;

  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
    const TestRoute = Route.extend(
      MixinImplementingBeforeModel,
      UnauthenticatedRouteMixinMixin,
      {
        transitionTo(routeName) {
          return routeName;
        },
      }
    );

    this.owner.register('route:test', TestRoute);
  });

  test('session is authenticated and has group', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner
      .lookup('service:session')
      .set('data.authenticated.group', 'true');

    route = this.owner.lookup('route:test');

    assert.notOk(route.beforeModel(transition));
  });

  test('session is not authenticated', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', false);

    route = this.owner.lookup('route:test');

    route
      .beforeModel(transition)
      .then(res => assert.equal(res, 'upstreamReturnValue'));
  });

  test('session is authenticated but no group', function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    route = this.owner.lookup('route:test');

    route
      .beforeModel(transition)
      .then(res => assert.equal(res, 'upstreamReturnValue'));
  });
});
