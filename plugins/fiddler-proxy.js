'use strict';

var url = require('url');
var tunnelAgent = require('tunnel-agent');

var DEFAULT_FIDDLER_URL = 'http://127.0.0.1:8888';

var allowedHeaders = ['accept', 'accept-charset', 'accept-encoding', 'accept-language', 'accept-ranges', 'cache-control', 'content-encoding', 'content-language',
// 'content-length',
'content-location', 'content-md5', 'content-range', 'content-type', 'connection', 'date', 'expect', 'max-forwards', 'pragma', 'referer', 'te', 'transfer-encoding', 'user-agent', 'via'].reduce(function (set, header) {
  set[header] = true;
  return set;
}, {});

function makeProxyHeaders(headers) {
  return Object.keys(headers).filter(function (header) {
    return allowedHeaders[header.toLowerCase()];
  }).reduce(function (set, header) {
    set[header] = headers[header];
    return set;
  }, {});
}

var agentFactories = {
  'https:https:': tunnelAgent.httpsOverHttps,
  'https:http:': tunnelAgent.httpsOverHttp,
  'http:https:': tunnelAgent.httpOverHttps,
  'http:http:': tunnelAgent.httpOverHttp
};
function getAgentFactory(targetProtocol, proxyProtocol) {
  return agentFactories[targetProtocol + proxyProtocol].bind(tunnelAgent);
}

function addFiddlerProxy(conf, proxy) {
  if (process.env.USE_FIDDLER) {
    conf.agent = getAgentFactory(conf.port === 443 ? 'https:' : 'http:', proxy.protocol)({
      proxy: {
        host: proxy.hostname,
        port: proxy.port,
        headers: makeProxyHeaders(conf.headers)
      },
      headers: conf.headers,
      rejectUnauthorized: false
    });
  }
  return conf;
}

module.exports = function (opts) {
  opts = opts || {};
  opts.url = opts.url || DEFAULT_FIDDLER_URL;
  var proxy = url.parse(opts.url);

  return function FiddlerProxyPlugin(client) {
    var previous = client.requestTransform || function identity(x) {
      return x;
    };
    client.requestTransform = function (conf) {
      return addFiddlerProxy(previous(conf), proxy);
    };
  };
};