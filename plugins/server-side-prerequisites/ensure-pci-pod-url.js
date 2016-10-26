'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var TenantCache = require('../../utils/tenant-cache');
var EnvUrls = require('mozu-metadata/data/environments.json');
var getUrlTemplate = require('../../utils/get-url-template');
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `basePciUrl` in its context.
 * Reads from the TenantCache if necessary, and consumes mozu-metadata.
 */

var PCIUrlsByBaseUrl = Object.keys(EnvUrls).reduce(function (o, c) {
  o[EnvUrls[c].homeDomain] = EnvUrls[c];
  return o;
}, {});

module.exports = function (state) {
  var client = state.client;
  var requestConfig = state.requestConfig;
  var url = requestConfig.url;

  if (~getUrlTemplate(url).keysUsed.indexOf('pciPod') && !client.context.basePciUrl && !client.context.pciPod) {
    var _ret = function () {
      var tenantId = client.context.tenantId || client.context.tenant;
      var pciUrls = PCIUrlsByBaseUrl[client.context.baseUrl];
      if (!tenantId) {
        throw new Error('Could not place request to ' + url + ' because it requires a tenant ' + 'ID to be set in the client context.');
      } else if (!pciUrls) {
        throw new Error('Could not place request to ' + url + ' because it is making a call to ' + 'Payment Service, but there is no known payment service domain ' + ('matching the environment whose base URL is ' + client.context.baseUrl + '.'));
      } else {
        return {
          v: TenantCache.get(tenantId, client, getScopeFromState(state)).then(function (t) {
            if (t.isDevTenant) {
              client.context.basePciUrl = pciUrls.paymentServiceSandboxDomain;
            } else {
              client.context.basePciUrl = pciUrls.paymentServiceTenantPodDomain;
            }
            return state;
          })
        };
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return state;
  }
};