'use strict';

var _require = require('./deep-clone'),
    deepClone = _require.deepClone;

var TenantClient = void 0;
var TenantsOrPromisesById = {};

module.exports = {
  add: function add(tenant) {
    TenantsOrPromisesById[tenant.id] = tenant;
  },
  get: function get(tenantId, client, scope) {
    TenantClient = TenantClient || require('../clients/platform/tenant');
    var tenant = TenantsOrPromisesById[tenantId];
    if (tenant) {
      // may not be a promise if it was set en masse by AuthProvider.
      // AuthProvider may set hundreds of tenants at once, so we let it
      // set them directly for performance reasons.
      if (typeof tenant.then !== "function") {
        // and turn them into promises as needed.
        tenant = TenantsOrPromisesById[tenantId] = Promise.resolve(tenant);
      }
      return tenant;
    } else {
      var newClient = deepClone(client);
      if (newClient.context['user-claims']) {
        delete newClient.context['user-claims'];
      }
      if (newClient.context['jwt']) {
        delete newClient.context['jwt'];
      }
      return TenantsOrPromisesById[tenantId] = new TenantClient(newClient).getTenant(null, { scope: scope });
    }
  }
};