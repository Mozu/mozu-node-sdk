var uritemplate = require('uritemplate'),
extend = require('node.extend'),
findWhere = require('./find-where');

var templateCache = {};

function wipeout(why) {
  throw new Error("Could not create URL from template. " + why);
}

function makeTenantPodUrlFromContext(context) {
  var tenant,
  extra = {};
  if (!context.tenantPod) {
    if (!context.tenantId) wipeout("No tenant ID set.");
    if (!context.availableTenants) wipeout("No available tenants collection in context. Was AuthProvider.getAdminUserAuthTicket ever called?");
    tenant = findWhere(context.availableTenants || [], { id: context.tenantId });
    if (!tenant) wipeout("Tenant " + context.tenantId + " not found in collection of available tenants: " + context.availableTenants.map(function(t) { return t.id }));
    extra.tenantPod = "https://" + tenant.domain + "/";
  }
  return extend(extra, context);
}

/**
 * Creates, evaluates based on context, and returns a string URL for a Mozu API request.
 * @param  {Object} context The context of a client. Should have a `baseUrl` property at minimum.
 * @param  {string} tpt     A string to be compiled into a UriTemplate. Should be a valid UriTemplate.
 * @param  {Object} body      An object consisting of the JSON body of the request, to be used to interpolate URL paramters.
 * @return {string}         A fully qualified URL.
 */
module.exports = function makeUrl(context, tpt, body) {
  var template = templateCache[tpt] || (templateCache[tpt] = uritemplate.parse(tpt)),
    initialContext = {
      homePod: context.baseUrl
    };

  if (tpt.indexOf('{+tenantPod}') !== -1) {
    initialContext.tenantPod = makeTenantPodUrlFromContext(context);
  }
  var ctx = extend(initialContext, context, body);
  return template.expand(ctx);
}
