var constants = require('../constants');
var when = require('when');
var extend = require('node.extend');
var path = require('path');
var url = require('url');
var protocolHandlers = {
  'http:': require('http'),
  'https:': require('https')
};
var streamToCallback = require('./stream-to-callback');
var addFiddlerProxy = require('./add-fiddler-proxy');
var parseJsonDates = require('./parse-json-dates');
var errorify = require('./errorify');

var USER_AGENT = 'Mozu Node SDK v' + constants.version + ' (Node.js ' + process.version + '; ' + process.platform + ' ' + process.arch + ')';


// needle.defaults({
//   compressed: true,
//   //follow: 10,
//   //accept: 'application/json',
//   //parse_response: false,
//   //user_agent: 
// });

/**
 * Handle headers
 */ 
function makeHeaders(conf) {
  var headers;
  function iterateHeaders(memo, key) {
    if (conf.context[constants.headers[key]]) {
      memo[constants.headerPrefix + constants.headers[key]] = conf.context[constants.headers[key]];
    }
    return memo;
  }
  if (conf.scope && conf.scope & constants.scopes.NONE) {
    headers = {};
  } else if (conf.scope && conf.scope & constants.scopes.APP_ONLY) {
    headers = ['APPCLAIMS'].reduce(iterateHeaders, {});
  } else {
    headers = Object.keys(constants.headers).reduce(iterateHeaders, {});
  }

  if (conf.body) {
    headers['Transfer-Encoding'] = 'chunked';
  }

  return extend({
    'accept': 'application/json',
    'connection': 'close',
    'content-type': 'text/json; charset=UTF-8',
    'user-agent': USER_AGENT,
  }, headers, conf.headers || {});
}

/**
 * Make an HTTP request to the Mozu API. This method populates headers based on the scope of the supplied context.
 * @param  {Object} options The request options, to be passed to the `request` module. Look up on NPM for details.
 * @return {Promise<ApiResponse,ApiError>}         A Promise that will fulfill as the JSON response from the API, or reject with an error as JSON from the API.
 */

module.exports = function(options) {
  var conf = extend({}, options);
  conf.method = (conf.method || 'get').toUpperCase();
  conf.headers = makeHeaders(conf);
  if (process.env.USE_FIDDLER) {
    conf = addFiddlerProxy(conf);
  }
  var uri = url.parse(conf.url);
  var protocolHandler = protocolHandlers[uri.protocol];
  if (!protocolHandler) {
    throw new Error('Protocol ' + uri.protocol + ' not supported.');
  }
  return when.promise(function(resolve, reject) {
    var requestOptions = {
      hostname: uri.hostname,
      port: uri.port || (uri.protocol === 'https:' ? 443 : 80),
      method: conf.method,
      path: uri.path,
      headers: conf.headers,
      agent: conf.agent
    };
    var request = protocolHandler.request(requestOptions, function(response) {
      streamToCallback(response, function(err, body) {
        if (err) return reject(err);
        try {
          body = JSON.parse(body, (conf.parseDates !== false) && parseJsonDates);
        } catch(e) { 
          return reject(new Error('Response was not valid JSON: ' + e.message + '\n\n-----\n' + body));
        }
        if (response && response.statusCode >= 400 && response.statusCode < 600) return reject(errorify(response));
        return resolve(body);
      })
    });
    request.setTimeout(options.timeout || 20000, reject)
    request.on('error', reject);
    if (conf.body) {
      var payload = conf.body;
      if (typeof payload !== "string") {
        payload = JSON.stringify(payload);
      }
      request.write(payload);
    }
    request.end();
  });
};