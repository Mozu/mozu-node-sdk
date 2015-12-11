'use strict';

var AuthProvider = require('../../security/auth-provider');
var scopes = require('../../constants').scopes;
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add application claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function (state) {
  var client = state.client;

  var scope = getScopeFromState(state);

  if (scope & scopes.APP_REQUIRED || !(scope & scopes.NONE || scope & scopes.DEVELOPER)) {
    return AuthProvider.addPlatformAppClaims(client).then(function () {
      return state;
    });
  } else {
    return state;
  }
};