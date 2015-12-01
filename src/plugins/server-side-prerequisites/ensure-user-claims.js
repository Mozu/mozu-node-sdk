'use strict';
const AuthProvider = require('../../security/auth-provider');
const scopes = require('../../constants').scopes;
const getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add developer user claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function(state) {
  let client = state.client;
  let scope = getScopeFromState(state);

  if (scope & scopes.DEVELOPER) {
    return AuthProvider.addDeveloperUserClaims(client).then(() => state);
  } else if (scope & scopes.ADMINUSER) {
    return AuthProvider.addAdminUserClaims(client).then(() => state);
  } else if (!scope && AuthProvider.addMostRecentUserClaims) {
    return AuthProvider.addMostRecentUserClaims(client).then(() => state);
  } else {
    return state;
  }

};
