var tunnelAgent = require('tunnel-agent');

var allowedHeaders = [
  'accept',
  'accept-charset',
  'accept-encoding',
  'accept-language',
  'accept-ranges',
  'cache-control',
  'content-encoding',
  'content-language',
  'content-length',
  'content-location',
  'content-md5',
  'content-range',
  'content-type',
  'connection',
  'date',
  'expect',
  'max-forwards',
  'pragma',
  'referer',
  'te',
  'transfer-encoding',
  'user-agent',
  'via'
].reduce(function(set, header) {
  set[header] = true;
  return set;
}, {});

var onlyHeaders = [
  'proxy-authorization'
];

function makeProxyHeaders(headers) {
  return Object.keys(headers)
    .filter(function(header) {
      return allowedHeaders[header.toLowerCase()];
    })
    .reduce(function(set, header) {
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

module.exports =  function(agentConfig) {
  var headers = agentConfig.headers,
      target = agentConfig.target,
      proxy = agentConfig.proxy;
  return getAgentFactory(target.protocol, proxy.protocol)({
    proxy: {
      host: proxy.hostname,
      port: proxy.port,
      headers: makeProxyHeaders(headers)
    },
    headers: headers,
    rejectUnauthorized: false
  });
}