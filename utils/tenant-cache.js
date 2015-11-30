var TenantClient = require('../clients/platform/tenant');
var TenantsOrPromisesById = {};

module.exports = {
  set: function(tenant) {
    TenantPromisesById[tenant.id] = tenant;
  },
  get: function(client, tenantId) {
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
      return TenantPromisesById[tenantId] =
        (new TenantClient(client)).getTenant();
    }
  }
};
