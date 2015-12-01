'use strict';
const TenantCache = require('../../utils/tenant-cache');
const getUrlTemplate = require('../../utils/get-url-template');
const getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `tenantPod` in its context.
 * Reads from the TenantCache if necessary.
 */

module.exports = function(state) {
  let client = state.client;
  let requestConfig = state.requestConfig;
  let url = requestConfig.url;

  if (
    ~getUrlTemplate(url).keysUsed.indexOf('tenantPod') &&
    !client.context.tenantPod
  ) {
    let tenantId = client.context.tenantId || client.context.tenant;
    if (!tenantId) {
      throw new Error(
        `Could not place request to ${url} because it requires a tenant ` +
        `ID to be set in the client context.`
      );
    } else {
      return TenantCache.get(
        tenantId,
        client,
        getScopeFromState(state)
      ).then(tenant => {
        client.context.tenantPod = 'https://' + tenant.domain + '/';
        return state;
      })
    }
  } else {
    return state;
  }

};
