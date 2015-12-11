'use strict';
var test = require('tape');
var jort = require('jort');

var TenantClient = require(
  '../clients/platform/tenant'
);

var FiddlerProxy = require('../plugins/fiddler-proxy');
var shouldTestLive = require('./should-test-live');
var scopes = require('../constants').scopes;

var testContext;
try {
  testContext = require('../mozu.test.config.json');
} catch(e) {
  testContext = {};
}
var testPlatformService = function(assert, client, noscope) {
  assert.plan(5);
  client.getTenant({ 
    tenantId: client.context.tenantId
  }, {
    scope: noscope && scopes.NONE || (scopes.DEVELOPER | scopes.APP_REQUIRED)
  }).then(function(tenant) {
    assert.ok(tenant, 'result delivered');
    assert.ok(tenant.domain, 'tenant has domain');
    assert.ok(tenant.id, 'tenant has id');
    assert.ok(tenant.sites, 'tenant has sites');
    assert.ok(Array.isArray(tenant.sites), 'sites is a list');
  }).catch(assert.fail);
};

test(
  'platform/tenant returns a tenant from GetTenant',
  function(assert) {
    if (shouldTestLive()) {
      testPlatformService(
        assert,
        new TenantClient({ context: testContext, plugins: [FiddlerProxy()]})
      );
    } else {
      jort({
        domain: 'example.com',
        id: 1,
        sites: [
          {}
        ]
      }).then(function(serviceUrl) {
        var client = new TenantClient({ context: testContext });
        client.context.baseUrl = serviceUrl;
        testPlatformService(assert, client, true);
      });
    }
  }
);
