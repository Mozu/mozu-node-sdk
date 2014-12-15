var uritemplate = require('uritemplate'),
extend = require('node.extend'),
AuthProvider = require('../auth-provider'),
findWhere = require('./find-where');

var templateCache = {};

function wipeout(why) {
  throw new Error("Could not create URL from template. " + why);
}

function makeTenantPodUrl(context) {
  var tenant,
    availableTenants = AuthProvider.getUserTenants(context.user.id);
  if (!context.tenantId) wipeout("No tenant ID set.");
  if (!availableTenants) wipeout("No available tenants collection in context. Was AuthProvider.getAdminUserAuthTicket ever called?");
  tenant = findWhere(availableTenants || [], { id: context.tenantId });
  if (!tenant) wipeout("Tenant " + context.tenantId + " not found in collection of available tenants: " + availableTenants.map(function(t) { return t.id }));
  return "https://" + tenant.domain + "/";
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
      homePod: context.baseUrl
    }, context, body);

  if (tpt.indexOf('{+tenantPod}') !== -1 && !ctx.tenantPod) {
    ctx.tenantPod = makeTenantPodUrl(ctx);
  }
  return template.expand(ctx);
}
