var needle = require('needle'),
    util = require('util'),
    constants = require('../constants'),
    makeLocalProxyAgent = require('./make-local-proxy-agent'),
    when = require('when'),
    extend = require('node.extend');


function errorify(res) {
  if (typeof res === "string") {
    return new Error(res);
  }
  var message = res.message || res.body && res.body.message;
  var err;
  var stringBody = typeof res.body === "string" ? res.body : (Buffer.isBuffer(res.body) ? res.body.toString() : null);
  var parsedBody;

  if (!message && stringBody) {
    try {
      parsedBody = JSON.parse(stringBody);
      message = parsedBody.message || stringBody;
    } catch(e) {
      message = stringBody;
    }
  }

  err = new Error(message || "Unknown error!");
  err.originalError = parsedBody || stringBody || res.body;
  return err;
}

needle.defaults({
  compressed: true,
  follow: 10,
  timeout: 20000,
  accept: 'application/json',
  parse_response: false,
  user_agent: 'Mozu Node SDK v' + constants.version
});

function makeHeaders(conf) {

  function iterateHeaders(memo, key) {
    if (conf.context[constants.headers[key]]) {
      memo[constants.headerPrefix + constants.headers[key]] = conf.context[constants.headers[key]];
    }
    return memo;
  }

  if (conf.scope && conf.scope & constants.scopes.NONE) {
    return {};
  } else if (conf.scope && conf.scope & constants.scopes.APP_ONLY) {
    return ['APPCLAIMS'].reduce(iterateHeaders, {});
  } else {
    return Object.keys(constants.headers).reduce(iterateHeaders, {});
  }

  // 
  // until scopes can reflect accurately out of the service classes, we'll just push all the context we have
  // 
  // if (context[APPCLAIMS]) headers[APPCLAIMS] = context[APPCLAIMS];
  // if (context[DATAVIEWMODE]) {
  //   headers[DATAVIEWMODE] = context[DATAVIEWMODE];
  // } 
  // if (conf.scope & (scopes.DEVELOPER | scopes.ADMINUSER | scopes.SHOPPER)) {
  //   headers[USERCLAIMS] = context[USERCLAIMS];
  // }
  // if (((conf.scope & scopes.TENANT) == scopes.TENANT) && context[TENANT]) {
  //   headers[TENANT] = context[TENANT];
  // }
  // if (((conf.scope & scopes.SITE) == scopes.SITE) && context[SITE]) {
  //   headers[SITE] = context[SITE];
  // }
  // if (((conf.scope & scopes.MASTERCATALOG) == scopes.MASTERCATALOG) && context[MASTERCATALOG]) {
  //   headers[MASTERCATALOG] = context[MASTERCATALOG];
  // }
  // if (((conf.scope & scopes.CATALOG) == scopes.CATALOG) && context[CATALOG]) {
  //   headers[CATALOG] = context[CATALOG];
  // }
  // return headers;
}

var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
function parseDate(key, value) {
  return (typeof value === 'string' && reISO.exec(value)) ? new Date(value) : value;
}

/**
 * Make an HTTP request to the Mozu API. This method populates headers based on the scope of the supplied context.
 * @param  {Object} options The request options, to be passed to the `request` module. Look up on NPM for details.
 * @return {Promise<ApiResponse,ApiError>}         A Promise that will fulfill as the JSON response from the API, or reject with an error as JSON from the API.
 */

module.exports = function(options) {
  var deferred = when.defer(),
      conf = extend({}, options);
  conf.headers = makeHeaders(conf);
  if (process.env.USE_FIDDLER) {
    conf.agent = makeLocalProxyAgent(conf.headers);
  }
  needle.request(conf.method, conf.url, conf.body, conf, function(err, response, body) {
    if (err) return deferred.reject(err);
    try {
      body = JSON.parse(body, (conf.parseDates !== false) && parseDate);
    } catch(e) { 
      return deferred.reject(new Error('Response was not valid JSON: ' + e.message + '\n\n-----\n' + body));
    }
    if (response && response.statusCode >= 400 && response.statusCode < 600) deferred.reject(errorify(response));
    return deferred.resolve(body);
  });
  return deferred.promise;
};