'use strict';
var test = require('tape');
var jort = require('jort');

var LegacySDK = require('../');
var testContext = require('./_test-context');
var ProductAdminClient = require(
  '../clients/commerce/catalog/admin/product');

var FiddlerProxy = require('../plugins/fiddler-proxy');
var shouldTestLive = require('./_should-test-live');

var testProductService = function(assert, client) {
  assert.plan(3);
  client.getProducts(
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
};

var runTests;

if (shouldTestLive()) {
  runTests = function(client) {
    return function(assert) {
      testProductService(assert, client);
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
      }).then(function(serviceUrl) {
        client.context.tenantPod = serviceUrl;
        testProductService(assert, client);
      });
    }
  };
}

test(
  'returns Products from ProductAdmin.GetProducts',
  runTests(new ProductAdminClient({ 
    context: testContext,
    plugins: [FiddlerProxy()]
  })));

test(
  'legacy client access still returns Products',
  runTests(LegacySDK.client(testContext, { plugins: [FiddlerProxy()] })
                      .commerce().catalog().admin().product()));
