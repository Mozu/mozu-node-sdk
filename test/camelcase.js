'use strict';
var test = require('tape');
var TenantClient = require('../clients/platform/tenant');

var client = new TenantClient({
  context: {
    baseUrl: 'http://example.com',
    'dataview-mode': 'PENDING',
    appClaims: 'camelClaims',
    'app-claims': 'dash-claims',
    'user-claims': 'dash-claims',
    userClaims: 'camelClaims',
    siteId: 'camelId',
    catalogId: 'camelId',
    masterCatalogId: 'camelId',
    tenant: 'lower-tenant',
    site: 'lower-site',
    catalog: 'lower-catalog',
    'master-catalog': 'lower-master-catalog'
  }
});

var context = client.context;

test('context value casing', function(assert) {
  assert.plan(7);
  assert.equal(context['dataview-mode'], 'PENDING',
              'can be provided in dash-case or camelCase');
  assert.equal(context['app-claims'], 'camelClaims',
              'camelCase preferred for appClaims');
  assert.equal(context['user-claims'], 'camelClaims',
              'camelCase preferred for everything');
  assert.equal(context.tenant, 'lower-tenant',
              'legacy props `tenant` supported');
  assert.equal(context.site, 'camelId',
              'modern `tenantId` and `siteId` convention preferred');
  assert.equal(context.catalog, 'camelId',
              'modern `catalogId` convention preferred');
  assert.equal(context['master-catalog'], 'camelId',
              'camelCased with -Id preferred');
});
