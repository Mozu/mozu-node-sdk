var AuthProvider = require('../security/auth-provider'),
    scopes = require('../constants').scopes;

const PrerequisiteTasks = [
  require('./ensure-tenant-pod-url'),
  require('./ensure-pci-pod-url'),
  require('./ensure-developer-user-claims'),
  require('./ensure-admin-user-claims'),
  require('./ensure-')
]

/**
 * Return a Promise that will resolve when all necessary prerequisites are
 * satisfied for the given client and request configuration.
 * This includes gathering authentication, adding missing context values
 * like tenant URLs and PCI URLs, and anything else.
 * @param {Client} client The client which wants to run the request.
 * @param {Object} options Options sent along with the request, including body.
 * @param {Object} requestConfig The request configuration, including URL.
 */
function satisfyPrerequisites(client, options, requestConfig) {
  return PrerequisiteTasks.reduce((p, t) => p.then(t), Promise.resolve(true));
}

var tenantsCache = {};

var makeTenantClient = (function() {
  var c;
  return function() {
    return (c || (c = require('../clients/platform/tenant'))).apply(this, arguments);
  };
}());

function urlRequiresTenantPod(template) {
  return template.indexOf('{+tenantPod}') !== -1;
}

function urlRequiresPciPod(template) {
  return template.indexOf('{+pciPod}') !== -1;
}

function cacheTenantsFromTicket(ticket) {
  var tenants = ticket.availableTenants;
  if (tenants) {
    for (var i = 0; i < tenants.length; i++) {
      tenantsCache[tenants[i].id] = tenants[i];
    }
  }
  delete ticket.availableTenants;
  return ticket;
}

function getTenantInfo(id) {
  return tenantsCache[id];
}


  /**
 * Return an array of tasks (functions returning Promises) that performs, in sequence, all necessary authentication tasks for the given scope.
 * @param  {Client} client The client in whose context to run the tasks. AuthProvider will cache the claims per client.
 * @param  {Scope} scope  A scope (bitmask). If the scope is not NONE, then app claims will be added. If the scope is DEVELOPER xor ADMINUSER, user claims will be added.
 * @return {Array}        A list of tasks. If no auth is required, the list will be empty.
 */
 function getTasks(client, options, requestConfig) {

  var tenantId = client.context.tenant || client.context.tenantId;
  var scope;
  // support a named scope, or a reference to a scope bitmask
  if (options && options.scope) {
    if (scopes[options.scope]) {
      scope = scopes[options.scope];
    } else {
      scope = options.scope;
    }
  } else {
    scope = requestConfig.scope;
  }

  var tasks = [];

  if (scope & scopes.DEVELOPER) {
    tasks.push(function() {
      return AuthProvider.addDeveloperUserClaims(client).then(cacheTenantsFromTicket);
    });
  } else if (scope & scopes.ADMINUSER) {
    tasks.push(function() {
      return AuthProvider.addAdminUserClaims(client).then(cacheTenantsFromTicket);
    });
  }
  if (!scope && AuthProvider.addMostRecentUserClaims) {
    tasks.push(function() {
      return AuthProvider.addMostRecentUserClaims(client);
    });
  }

  //if url requires a PCI pod but we don't have a tenant to find out
  //whether we're a sandbox tenant, we need to know that

  //if url requires a PCI pod but context is not set throw error
  if (urlRequiresPciPod(requestConfig.url)) {
    if (!client.context.basePciUrl) {
      throw new Error("Could not perform request to PCI service '" + requestConfig.url + "'; no tenant ID was set.");
    }
  }

  // if url requires a tenant pod but we don't have one...
  var currentTenant;
  if (urlRequiresTenantPod(requestConfig.url) && !client.context.tenantPod) {
    if (!tenantId) {
      throw new Error("Could not perform request to tenant-scoped service '" + requestConfig.url + "'; no tenant ID was set.");
    }
    currentTenant = getTenantInfo(tenantId);
    if (currentTenant) {
      client.context.tenantPod = 'https://' + currentTenant.domain + '/';
    } else {
      tasks.push(function() {
        return makeTenantClient(client).getTenant().then(function(tenant) {
          tenantsCache[tenant.id] = tenant;
          client.context.tenantPod = 'https://' + tenant.domain + '/';
        });
      });
    }
  } 

  if (!((scope & scopes.NONE) || (scope & scopes.DEVELOPER))) {
    tasks.push(function() {
      return AuthProvider.addPlatformAppClaims(client);
    });
  }

  return tasks;
}

module.exports = {
  getTasks: getTasks
};
