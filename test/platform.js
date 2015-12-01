'use strict';
var test = require('tape');
var jort = require('jort');

var TenantClient = require(
  '../clients/platform/tenant');

var FiddlerProxy = require('../plugins/fiddler-proxy');

var testContext;
var testPlatformService = function(assert, client, noscope) {
  assert.plan(5);
  client.getTenant({ 
    tenantId: client.context.tenantId
  }, {
    scope: noscope && 'NONE' || 'ADMINUSER'
  }).then(function(tenant) {
    assert.ok(tenant, 'result delivered');
    assert.ok(tenant.domain, 'tenant has domain');
    assert.ok(tenant.id, 'tenant has id');
    assert.ok(tenant.sites, 'tenant has sites');
    assert.ok(Array.isArray(tenant.sites), 'sites is a list');
  }).catch(assert.fail);
};

var runTests;

if (process.env.MOZU_TEST_LIVE) {
  try {
    testContext = require('../mozu.test.config.json');
  } catch(e) {
    testContext = {};
  }
  runTests = function(client) {
    return function(assert) {
      testPlatformService(assert, client);
    }
  }
} else {
  runTests = function(client) {
    return function(assert) {
      jort({
        domain: 'example.com',
        id: 1,
        sites: [
          {}
        ]
      }).then(function(serviceUrl) {
        client.context.baseUrl = serviceUrl;
        testPlatformService(assert, client, true);
      });
    }
  };
}

test(
  'platform/tenant returns a tenant from GetTenant',
  runTests(new TenantClient({
    context: testContext,
    plugins: [FiddlerProxy]
  })));


