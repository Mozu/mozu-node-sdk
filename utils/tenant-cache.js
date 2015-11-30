var TenantClient = require('../clients/platform/tenant');
var TenantPromisesById = {};

module.exports = {
  set: function(tenant) {
    TenantPromisesById[tenant.id] = Promise.resolve(tenant);
  },
  get: function(client, tenantId) {
    return TenantPromisesById[tenantId] ||
      TenantPromisesById[tenantId] = (new TenantClient(client)).getTenant();
  }
};
