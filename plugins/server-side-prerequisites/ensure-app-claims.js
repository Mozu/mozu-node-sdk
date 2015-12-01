'use strict';

var AuthProvider = require('../../security/auth-provider');
var scopes = require('../../constants').scopes;

/**
 * If necessary, add application claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function (state) {
  var client = state.client;
  var requestConfig = state.requestConfig;
  var options = state.options;

  var scope = undefined;
  if (options && options.scope) {
    if (scopes[options.scope]) {
      scope = scopes[options.scope];
    } else {
      scope = options.scope;
    }
  } else {
    scope = requestConfig.scope;
  }

  if (!(scope & scopes.NONE || scope & scopes.DEVELOPER)) {
    return AuthProvider.addPlatformAppClaims(client).then(function () {
      return state;
    });
  } else {
    return state;
  }
};