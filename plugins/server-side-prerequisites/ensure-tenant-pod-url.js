'use strict';

var TenantCache = require('../../utils/tenant-cache');
var getUrlTemplate = require('../../utils/get-url-template');
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, transforms a promise for a prepared client into a promise
 * for a client that has a `tenantPod` in its context.
 * Reads from the TenantCache if necessary.
 */

module.exports = function (state) {
  var client = state.client;
  var requestConfig = state.requestConfig;
  var url = requestConfig.url;

  if (~getUrlTemplate(url).keysUsed.indexOf('tenantPod') && !client.context.tenantPod) {
    var tenantId = client.context.tenantId || client.context.tenant;
    if (!tenantId) {
      throw new Error('Could not place request to ' + url + ' because it requires a tenant ' + 'ID to be set in the client context.');
    } else {
      return TenantCache.get(tenantId, client, getScopeFromState(state)).then(function (tenant) {
        client.context.tenantPod = 'https://' + tenant.domain + '/';
        return state;
      });
    }
  } else {
    return state;
  }
};