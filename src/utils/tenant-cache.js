'use strict';

let TenantClient;
let TenantsOrPromisesById = {};

module.exports = {
  add: function(tenant) {
    TenantsOrPromisesById[tenant.id] = tenant;
  },
  get: function(tenantId, client, scope) {
    TenantClient = TenantClient || require('../clients/platform/tenant');
    let tenant = TenantsOrPromisesById[tenantId];
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
      return TenantsOrPromisesById[tenantId] =
        (new TenantClient(client)).getTenant(null, { scope: scope });
    }
  }
};
