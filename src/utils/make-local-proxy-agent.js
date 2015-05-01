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

module.exports =  function(headers) {
  return tunnelAgent.httpsOverHttp({
    proxy: {
      host: '127.0.0.1',
      port: 8888,
      headers: makeProxyHeaders(headers)
    },
    headers: headers,
    rejectUnauthorized: false
  });
}