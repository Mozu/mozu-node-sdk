var uritemplate = require('uritemplate'),
extend = require('node.extend');

var templateCache = {};

function ensureTrailingSlash(url) {
  return (url.charAt(url.length-1) === "/") ? url : (url + "/");
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
      homePod: ensureTrailingSlash(context.baseUrl),
      tenantId: context.tenant, // URI templates expect tenantId
      pciPod: ensureTrailingSlash(context.basePciUrl)
    }, context, body);

  if (ctx.tenantPod) ctx.tenantPod = ensureTrailingSlash(ctx.tenantPod);
  return template.expand(ctx);
}
