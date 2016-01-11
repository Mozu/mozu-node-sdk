'use strict';
var test = require('tape');
var jort = require('jort');

var LegacySDK = require('../');
var testContext = require('./_test-context');
var OrderClient = require(
  '../clients/commerce/order');

var FiddlerProxy = require('../plugins/fiddler-proxy');
var shouldTestLive = require('./_should-test-live');

var testOrderService = function(assert, client) {
  assert.plan(3);
  client.getOrders(
    {
      pageSize: 3
    },
    {
      scope: 'NONE'
    }
  ).then(function(result) {
    assert.ok(result, 'result delivered');
    assert.equal(result.pageSize, 3, 'pagesize as expected');
    assert.equal(result.items.length, 3, 'items as expected');
  }).catch(assert.fail);
}

var runTests;

if (shouldTestLive()) {
  runTests = function(client) {
    return function(assert) {
      testOrderService(assert, client);
    }
  }
} else {
  runTests = function(client) {
    return function(assert) {
      jort({
        pageSize: 3,
        items: [
          {},
          {},
          {}
        ]
      }, { ipv6: false }).then(function(serviceUrl) {
        client.context.tenantPod = serviceUrl;
        testOrderService(assert, client);
      });
    }
  };
}

test('commerce/orders returns Orders from CommerceRuntime.GetOrders',
    runTests(new OrderClient({
      context: testContext,
      plugins: [FiddlerProxy()]
    })));

test('legacy client access still returns Products',
    runTests(LegacySDK.client(testContext, { plugins: [FiddlerProxy()] })
            .commerce().order()));
