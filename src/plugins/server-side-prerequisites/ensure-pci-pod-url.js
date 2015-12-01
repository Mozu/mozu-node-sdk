'use strict';
const TenantCache = require('../../utils/tenant-cache');
const EnvUrls = require('mozu-metadata/data/environments.json');
const getUrlTemplate = require('../../utils/get-url-template');
const getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `basePciUrl` in its context.
 * Reads from the TenantCache if necessary, and consumes mozu-metadata.
 */

const PCIUrlsByBaseUrl = Object.keys(EnvUrls).reduce(
  (o, c) => {
    o[EnvUrls[c].homeDomain] = EnvUrls[c];
    return o;
  },
  {}
);

module.exports = function(state) {
  let client = state.client;
  let requestConfig = state.requestConfig;
  let url = requestConfig.url;

  if (
    ~getUrlTemplate(url).keysUsed.indexOf('pciPod') &&
    !client.context.basePciUrl && !client.context.pciPod
  ) {
    let tenantId = client.context.tenantId || client.context.tenant;
    let pciUrls = PCIUrlsByBaseUrl[client.context.baseUrl];
    if (!tenantId) {
      throw new Error(
        `Could not place request to ${url} because it requires a tenant ` +
        `ID to be set in the client context.`
      );
    } else if (!pciUrls) {
      throw new Error(
        `Could not place request to ${url} because it is making a call to ` +
        `Payment Service, but there is no known payment service domain ` +
        `matching the environment whose base URL is ${client.context.baseUrl}.`
      );
    } else {
      return TenantCache.get(
        tenantId,
        client,
        getScopeFromState(state)
      ).then(t => {
        if (t.isDevTenant) {
          client.context.basePciUrl = pciUrls.paymentServiceSandboxDomain;
        } else {
          client.context.basePciUrl = pciUrls.paymentServiceTenantPodDomain;
        }
        return state;
      });
    }
  } else {
    return state;
  }

};
