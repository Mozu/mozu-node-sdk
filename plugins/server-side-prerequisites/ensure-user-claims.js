'use strict';

var AuthProvider = require('../../security/auth-provider');
var scopes = require('../../constants').scopes;
var getScopeFromState = require('./get-scope-from-state');

/**
 * If necessary, add developer user claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function (state) {
  var client = state.client;
  var scope = getScopeFromState(state);

  if (scope & scopes.DEVELOPER) {
    return AuthProvider.addDeveloperUserClaims(client).then(function () {
      return state;
    });
  } else if (scope & scopes.ADMINUSER) {
    return AuthProvider.addAdminUserClaims(client).then(function () {
      return state;
    });
  } else if (!scope && AuthProvider.addMostRecentUserClaims) {
    return AuthProvider.addMostRecentUserClaims(client).then(function () {
      return state;
    });
  } else {
    return state;
  }
};