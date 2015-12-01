'use strict';

var getUrlTemplate = require('../utils/get-url-template');
var extend = require('../utils/tiny-extend');

function ensureTrailingSlash(url) {
  return url.charAt(url.length - 1) === '/' ? url : url + '/';
}

/**
 * Creates, evaluates based on context, and returns a string URL for a Mozu API request.
 * @param  {Object} context The context of a client. Should have a `baseUrl` property at minimum.
 * @param  {string} tpt     A string to be compiled into a UriTemplate. Should be a valid UriTemplate.
 * @param  {Object} body      An object consisting of the JSON body of the request, to be used to interpolate URL paramters.
 * @return {string}         A fully qualified URL.
 */
module.exports = function () {
  return function (client, tpt, body) {
    var context = client.context;
    var template = getUrlTemplate(tpt);
    var fullTptEvalCtx = extend(
    // aliases for pod URLs and IDs first
    {
      homePod: context.baseUrl,
      pciPod: context.basePciUrl,
      tenantId: context.tenant,
      siteId: context.site,
      catalogId: context.catalog,
      masterCatalogId: context['master-catalog']
    },
    // all context values override those base values if provided
    context,
    // any matching values in the body override last.
    body);

    // ensure all base URLs have trailing slashes.
    ['homePod', 'pciPod', 'tenantPod'].forEach(function (x) {
      if (fullTptEvalCtx[x]) fullTptEvalCtx[x] = ensureTrailingSlash(fullTptEvalCtx[x]);
    });

    // don't pass the API version!
    if (!body || !body.hasOwnProperty("version")) delete fullTptEvalCtx.version;

    return template.render(fullTptEvalCtx);
  };
};