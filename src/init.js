// BEGIN INIT
var fs = require('fs'),
    extend = require('node.extend'),
    path = require('path'),
    Client = require('./client');

if (process.env.DEBUG && process.env.DEBUG.indexOf('mozu') !== -1) {
  require('when/monitor/console');
}

var legalConfigNames = ['mozu.config','mozu.config.json'];

function getConfig() {
  var conf;
  for (var i = legalConfigNames.length - 1; i >= 0; i--) {
    try {
      conf = fs.readFileSync(path.resolve(legalConfigNames[i]), 'utf-8');
    } catch(e) {}
    if (conf) break;
  }
  if (!conf) {
    throw new Error("No configuration file found. Either create a 'mozu.config' or 'mozu.config.json' file, or supply full config to the .client() method.");
  }
  try {
    conf = JSON.parse(conf);
  } catch(e) {
    throw new Error("Configuration file was unreadable: " + e.message);
  }
  return conf;
}


module.exports = {
  suppressUnhandledRejections: function() {
    // terrible, awful, but can't figure out the lifecycle here and when.js is logging
    // a potential pending rejection which messes up the prompt
    require('when').Promise.onPotentiallyUnhandledRejection = function() {};
  },
  setDefaultRequestOptions: function(options) {
    Client.defaultRequestOptions = options;
  },
  client: function(context, extraConfig) {
    context = context || {};
    
     if ( process.env.mozuHosted ) {
      try {
        context = extend( context, JSON.parse(process.env.mozuHosted).sdkConfig);

      } catch(e) {}
    }
    else{
      if (!context || !context.appKey || !context.sharedSecret  || !context.baseUrl || !context.basePciUrl) {
        context = extend(getConfig(), context);
      }
    }
    var config = {
      context: context
    };

    if (extraConfig) {
      extend(config, extraConfig);
    }
    return new Client(config);
  }
};
// END INIT