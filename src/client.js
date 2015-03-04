var extend = require('node.extend'),
    sub = require('./utils/sub'),
    makeMethod = require('./utils/make-method'),
    makeClient = require('./utils/make-client');

    

function Client(cfg) {
  extend(this, cfg);
  this.defaultRequestOptions = this.defaultRequestOptions || {};
}

extend(Client, {
  method: makeMethod,
  sub: function() {
    return makeClient(sub.apply(this, [Client].concat([].slice.call(arguments)))); 
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
