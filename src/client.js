var extend = require('node.extend'),
    sub = require('./utils/sub'),
    makeMethod = require('./utils/make-method'),
    makeClient = require('./utils/make-client'),
    inMemoryAuthCache = require('./security/in-memory-auth-cache');

function Client(cfg) {
  extend(this, cfg);
  this.defaultRequestOptions = this.defaultRequestOptions || {};
  this.authenticationStorage = this.authenticationStorage || cfg.plugins && cfg.plugins.authenticationStorage || inMemoryAuthCache();
}

extend(Client, {
  method: makeMethod,
  sub: function(methods) {
    return makeClient(sub(Client, methods));
  }
});

Client.prototype.root = function() {
  return new Client(this);
};


extend(Client.prototype, {
  commerce: require('./clients/commerce')(Client),
  content: require('./clients/content')(Client),
  event: require('./clients/event')(Client),
  platform: require('./clients/platform')(Client)
});

module.exports = Client;
