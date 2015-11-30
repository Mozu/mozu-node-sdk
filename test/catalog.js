'use strict';
var test = require('tape');
var jort = require('jort');

var LegacySDK = require('../');
var ProductAdminClient = require(
  '../clients/commerce/catalog/admin/product');

var FiddlerProxy = require('../plugins/fiddler-proxy');

var testContext;
var testProductService = function(assert, client) {
  assert.plan(3);
  client.getProducts({ pageSize: 3 }).then(function(result) {
    assert.ok(result, 'result delivered');
    assert.equal(result.pageSize, 3, 'pagesize as expected');
    assert.equal(result.items.length, 3, 'items as expected');
  }).catch(assert.fail);
};

var runTests;

if (process.env.MOZU_TEST_LIVE) {
  try {
    testContext = require('mozu.test.config.json');
  } catch(e) {
    testContext = {};
  }
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
  'payments/publicCard returns Products from ProductAdmin.GetProducts',
  runTests(new ProductAdminClient({ 
    context: testContext,
    plugins: [FiddlerProxy] 
  })));

test(
  'legacy client access still returns Products',
  runTests(LegacySDK.client(testContext, { plugins: [FiddlerProxy] })
                      .commerce().catalog().admin().product()));
