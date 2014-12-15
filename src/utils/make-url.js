var uritemplate = require('uritemplate'),
extend = require('node.extend'),
AuthProvider = require('../auth-provider'),
findWhere = require('./find-where');

var templateCache = {};

function wipeout(why) {
  throw new Error("Could not create URL from template. " + why);
}

function ensureTrailingSlash(url) {
  return (url.split().pop() === "/") ? url : (url + "/");
}

function ensureTenantPodUrl(context) {
  var tenant,
    availableTenants;
  if (!context.tenantPod) {
    if (!context.tenantId) wipeout("No tenant ID set.");
    availableTenants = AuthProvider.getContextTenants(context);
    if (!availableTenants) wipeout("No available tenants collection in context. Was AuthProvider.getAdminUserAuthTicket ever called?");
    tenant = findWhere(availableTenants || [], { id: context.tenantId });
    if (!tenant) wipeout("Tenant " + context.tenantId + " not found in collection of available tenants: " + availableTenants.map(function(t) { return t.id }));
    context.tenantPod = "https://" + tenant.domain + "/";
  }
  context.tenantPod = ensureTrailingSlash(context.tenantPod);
  return context;
}

/**
 * Creates, evaluates based on context, and returns a string URL for a Mozu API request.
 * @param  {Object} context The context of a client. Should have a `baseUrl` property at minimum.
 * @param  {string} tpt     A string to be compiled into a UriTemplate. Should be a valid UriTemplate.
 * @param  {Object} body      An object consisting of the JSON body of the request, to be used to interpolate URL paramters.
 * @return {string}         A fully qualified URL.
 */
module.exports = function makeUrl(client, tpt, body) {
  var context = client.context,
    template = templateCache[tpt] || (templateCache[tpt] = uritemplate.parse(tpt)),
    ctx = extend({
      homePod: ensureTrailingSlash(context.baseUrl)
    }, context, body);

  if (tpt.indexOf('{+tenantPod}') !== -1) {
    ensureTenantPodUrl(ctx);
  }
  return template.expand(ctx);
}
