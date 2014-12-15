var extend = require('node.extend'),
    sub = require('./utils/sub'),
    makeMethod = require('./utils/make-method'),
    makeClient = require('./utils/make-client'),
    constants = require('./constants'),
    findWhere = require('./utils/find-where'),
    camelCase = require('./utils/camel-case');
    

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

// dynamically create all the context accessors for the context values sent in
// request headers
Object.keys(constants.headers).forEach(function createAccessor(key) {
  var name = constants.headers[key], accessorName = camelCase(name);
  Client.prototype['get' + accessorName] = function() {
    return this.context[name];
  };
  Client.prototype['set' + accessorName] = function(val) {
    this.context[name] = this.context[name + "Id"] = val;
    return this;
  };
})

extend(Client.prototype, {
  commerce: require('./clients/commerce')(Client),
  content: require('./clients/content')(Client),
  event: require('./clients/event')(Client),
  platform: require('./clients/platform')(Client)
});

module.exports = Client;
