const AuthProvider = require('../security/auth-provider');
const scopes = require('../constants').scopes;

/**
 * If necessary, add application claims to a client context before
 * placing a request. Relies on a `scope` parameter to specify.
 * Uses AuthProvider.
 */

module.exports = function(state) {
  let client = state.client;
  let requestConfig = state.requestConfig;
  let options = state.options;

  let scope;
  if (options && options.scope) {
    if (scopes[options.scope]) {
      scope = scopes[options.scope];
    } else {
      scope = options.scope;
    }
  } else {
    scope = requestConfig.scope;
  }

  if (!((scope & scopes.NONE) || (scope & scopes.DEVELOPER))) {
    return AuthProvider.addPlatformAppClaims(client).then(() => state);
  } else {
    return state;
  }

};
