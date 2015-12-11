'use strict';
const AuthProvider = require('../../security/auth-provider');
const scopes = require('../../constants').scopes;
const getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add application claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function(state) {
  let client = state.client;

  let scope = getScopeFromState(state);

  if (scope & scopes.APP_REQUIRED || !((scope & scopes.NONE) || (scope & scopes.DEVELOPER))) {
    return AuthProvider.addPlatformAppClaims(client).then(() => state);
  } else {
    return state;
  }

};
