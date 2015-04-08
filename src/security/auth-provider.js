var constants = require('../constants'),
    when = require('when'),
    AuthTicket = require('./auth-ticket'),
    scopes = constants.scopes;

function getPlatformAuthTicket(client) {
  return client.platform().applications().authTicket().authenticateApp({
    applicationId: client.context.appKey,
    sharedSecret: client.context.sharedSecret
  }, {
    scope: scopes.NONE
  }).then(AuthTicket);
}

function refreshPlatformAuthTicket(client, ticket) {
  return client.platform().applications().authTicket().refreshAppAuthTicket({
    refreshToken: ticket.refreshToken
  }).then(AuthTicket);
}

function getDeveloperAuthTicket(client) {
  return client.root().platform().developer().developerAdminUserAuthTicket().createDeveloperUserAuthTicket(client.context.developerAccount).then(function(json) {
    return AuthTicket(json);
  });
}

function refreshDeveloperAuthTicket(client, ticket) {
  return client.root().platform().developer().developerAdminUserAuthTicket().refreshDeveloperAuthTicket(ticket).then(AuthTicket);
}

function getAdminUserAuthTicket(client) {
  return client.root().platform().adminuser().tenantAdminUserAuthTicket().createUserAuthTicket({ tenantId: client.context.tenant }, { 
    body: client.context.adminUser,
    scope: constants.scopes.APP_ONLY
  }).then(function(json) {
    client.context.user = json.user;
    return AuthTicket(json);
  })
}

function refreshAdminUserAuthTicket(client, ticket) {
  return client.root().platform().adminuser().tenantAdminUserAuthTicket().refreshAuthTicket(ticket, {
    scope: constants.scopes.APP_ONLY
  }).then(AuthTicket);
}

var calleeToClaimType = {
  'addPlatformAppClaims': 'application',
  'addDeveloperUserClaims': 'developer',
  'addAdminUserClaims': 'admin-user'
};

function makeClaimMemoizer(calleeName, requester, refresher, claimHeader) {
  return function(client) {
    var cacheAndUpdateClient = function(ticket) {
      return when.promise(function(resolve, reject) {
        client.authenticationStorage.set(calleeToClaimType[calleeName], client.context, ticket, function() {
          client.context[claimHeader] = ticket.accessToken;
          resolve(client);
        });
      });
    }
    var op = when.promise(function(resolve, reject) {
      client.authenticationStorage.get(calleeToClaimType[calleeName], client.context, function(err, ticket) {
        resolve(ticket);
      });
    }).then(function(ticket) {
      if (!ticket) {
        return requester(client).then(cacheAndUpdateClient);
      }
      if ((new Date(ticket.accessTokenExpiration)) < new Date()) {
        return refresher(client, ticket).then(cacheAndUpdateClient);
      }
      client.context[claimHeader] = ticket.accessToken;
      return client;
    });
    op.ensure(function() {
      AuthProvider.addMostRecentUserClaims = AuthProvider[calleeName];
    });
    return op;
  }
}


var AuthProvider = {

  addPlatformAppClaims: makeClaimMemoizer('addPlatformAppClaims', getPlatformAuthTicket, refreshPlatformAuthTicket, constants.headers.APPCLAIMS),
  addDeveloperUserClaims: makeClaimMemoizer('addDeveloperUserClaims', getDeveloperAuthTicket, refreshDeveloperAuthTicket, constants.headers.USERCLAIMS),
  addAdminUserClaims: makeClaimMemoizer('addAdminUserClaims', getAdminUserAuthTicket, refreshAdminUserAuthTicket, constants.headers.USERCLAIMS),
  addMostRecentUserClaims: false
};

module.exports = AuthProvider;
