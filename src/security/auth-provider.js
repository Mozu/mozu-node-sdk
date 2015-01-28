var constants = require('../constants'),
    when = require('when'),
    scopes = constants.scopes;

var tenantsCache = {},
    claimsCache = {};

/**
 * A promise that will resolve to an App Claims
 * @typedef {Object} AppClaimsPromise
 */

/**
 * The authentication ticket used to authenticate anything.
 * @class AuthTicket
 * @property {string} accessToken The token that stores an encrypted list of the application's configured behaviors and authenticates the application.
 * @property {Date} accessTokenExpiration Date and time the access token expires. After the access token expires, refresh the authentication ticket using the refresh token.
 * @property {string} refreshToken The token that refreshes the application's authentication ticket.
 * @property {Date} refreshTokenExpiration Date and time the refresh token expires. After the refresh token expires, generate a new authentication ticket.
 */
function AuthTicket(json) {
  var self = this;
  for (var p in json) {
    if (json.hasOwnProperty(p)) {
      self[p] = p.indexOf('Expiration') !== -1 ? new Date(json[p]) : json[p]; // dateify the dates, this'll break if the prop name changes
    }
  }
}
AuthTicket.create = function(json) {
  return new AuthTicket(json);
}

function cacheUserTenants(json) {
  if (json.availableTenants && json.availableTenants.length > 0) {
    tenantsCache[json.user.id] = json.availableTenants;
  }
}

function getPlatformAuthTicket(client) {
  return client.platform().applications().authTicket().authenticateApp({
    applicationId: client.context.appKey,
    sharedSecret: client.context.sharedSecret
  }, {
    scope: scopes.NONE
  }).then(AuthTicket.create);
}

function refreshPlatformAuthTicket(client, ticket) {
  return client.platform().applications().authTicket().refreshAppAuthTicket({
    refreshToken: ticket.refreshToken
  }).then(AuthTicket.create);
}

function getDeveloperAuthTicket(client) {
  return client.root().platform().developer().developerAdminUserAuthTicket().createDeveloperUserAuthTicket(client.context.developerAccount).then(function(json) {
    cacheUserTenants(json);
    return AuthTicket.create(json);
  });
}

function refreshDeveloperAuthTicket(client, ticket) {
  return client.root().platform().developer().developerAdminUserAuthTicket().refreshDeveloperUserAuthTicket(ticket).then(AuthTicket.create);
}

function getAdminUserAuthTicket(client) {
  return client.root().platform().adminuser().tenantAdminUserAuthTicket().createUserAuthTicket({ tenantId: client.getTenant() }, { body: client.context.developerAccount }).then(function(json) {
    client.context.user = json.user;
    cacheUserTenants(json);
    return AuthTicket.create(json);
  })
}

function refreshAdminUserAuthTicket(client, ticket) {
  return client.root().platform().adminuser().authtickets().refreshAuthTicket(ticket).then(AuthTicket.create);
}

function makeClaimMemoizer(calleeName, requester, refresher, claimHeader) {
  var claimCache = {};
  return function(client) {
    var claimsOp,
        now = new Date(),
        cached = claimCache[client.context.appKey],
        cacheAndUpdateClient = function(ticket) {
          claimCache[client.context.appKey] = ticket;
          client.context[claimHeader] = ticket.accessToken;
          return client;
        };
    if (!cached || (cached.refreshTokenExpiration < now && cached.accessTokenExpiration < now)) {
      return requester(client).then(cacheAndUpdateClient);
    } else if (cached.accessTokenExpiration < now && cached.refreshTokenExpiration > now) {
      claimsOp = refresher(client, cached).then(cacheAndUpdateClient);
    } else {
      client.context[claimHeader] = cached.accessToken;
      claimsOp = when(client);
    }
    claimsOp.ensure(function() {
      AuthProvider.addMostRecentUserClaims = AuthProvider[calleeName];
    });
    return claimsOp;
  };
}


var AuthProvider = {
  addPlatformAppClaims: makeClaimMemoizer('addPlatformAppClaims', getPlatformAuthTicket, refreshPlatformAuthTicket, constants.headers.APPCLAIMS),
  addDeveloperUserClaims: makeClaimMemoizer('addDeveloperUserClaims', getDeveloperAuthTicket, refreshDeveloperAuthTicket, constants.headers.USERCLAIMS),
  addAdminUserClaims: makeClaimMemoizer('addAdminUserClaims', getAdminUserAuthTicket, refreshAdminUserAuthTicket, constants.headers.USERCLAIMS),
  addMostRecentUserClaims: false,
  getUserTenants: function(userid) {
    return tenantsCache[userid];
  },
  getContextTenants: function(context) {
    if (context.user) {
      return AuthProvider.getUserTenants(context.user.id);
    }
    return claimsCache[context[constants.headers.APPCLAIMS]];
  },
  /**
 * Return an array of tasks (functions returning Promises) that performs, in sequence, all necessary authentication tasks for the given scope.
 * @param  {Client} client The client in whose context to run the tasks. AuthProvider will cache the claims per client.
 * @param  {Scope} scope  A scope (bitmask). If the scope is not NONE, then app claims will be added. If the scope is DEVELOPER xor ADMINUSER, user claims will be added.
 * @return {Array}        A list of tasks. If no auth is required, the list will be empty.
 */
  getAuthTasks: function(client, scope) {
    var tasks = [];
    if (scope & scopes.DEVELOPER) {
      tasks.push(function() {
        return AuthProvider.addDeveloperUserClaims(client);
      });
    } else if (scope & scopes.ADMINUSER) {
      tasks.push(function() {
        return AuthProvider.addAdminUserClaims(client);
      })
    }
    if (!scope && AuthProvider.addMostRecentUserClaims) {
      tasks.push(function() {
        return AuthProvider.addMostRecentUserClaims(client);
      });
    }
    if (!(scope & scopes.NONE)) {
      tasks.push(function() {
        return AuthProvider.addPlatformAppClaims(client);
      });
    }

    return tasks;
  }
};

module.exports = AuthProvider;
