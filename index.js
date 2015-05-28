var Client = require('./client');
var extend = require('node.extend');

module.exports = {
  suppressUnhandledRejections: function() {
    // terrible, awful, but can't figure out the lifecycle here and when.js is logging
    // a potential pending rejection which messes up the prompt
    require('when').Promise.onPotentiallyUnhandledRejection = function() {};
  },
  setDefaultRequestOptions: function(options) {
    Client.defaultRequestOptions = options;
  },
  client: function(ctx, config) {
    // to support the old lookup: client.platform().adminUser().tenantAdminUserAuthTicket() etc.
    config = config || {};
    if (ctx) config.context = ctx; 
    var client = new Client(config);
    // instance
    return extend(client, {
      root: function(cfg) {
        return module.exports.client(extend({}, this, cfg));
      },
      commerce: require('./clients/commerce'),
      content: require('./clients/content'),
      event: require('./clients/event'),
      platform: require('./clients/platform')
    });
  }
};
// END INIT