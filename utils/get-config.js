'use strict';
// BEGIN INIT

var fs = require('fs');
var findup = require('./tiny-findup');

var legalConfigNames = ['mozu.config', 'mozu.config.json'];

module.exports = function getConfig() {
  var conf;
  if (process.env.mozuHosted) {
    try {
      conf = JSON.parse(process.env.mozuHosted).sdkConfig;
    } catch (e) {
      throw new Error("Mozu hosted configuration was unreadable: " + e.message);
    }
  } else {
    for (var i = legalConfigNames.length - 1; i >= 0; i--) {
      try {
        var filename = findup(legalConfigNames[i]);
        if (filename) conf = fs.readFileSync(filename, 'utf-8');
      } catch (e) {
        continue;
      }
      if (conf) break;
    }
    if (!conf) {
      throw new Error("No configuration file found. Either create a 'mozu.config' or 'mozu.config.json' file, or supply full config to the .client() method.");
    }
    try {
      conf = JSON.parse(conf);
    } catch (e) {
      throw new Error("Configuration file was unreadable: " + e.message);
    }
  }
  return conf;
};