'use strict';
// BEGIN INIT

var fs = require('fs');
var findup = require('./tiny-findup');

var legalConfigNames = ['mozu.config', 'mozu.config.json'];

module.exports = function getConfig() {
  var confJson = null;
  var conf = {
    appKey: process.env.KIBO_CLIENT_ID || process.env.KIBO_APP_KEY,
    sharedSecret: process.env.KIBO_SHARED_SECRET,
    tenantPod: process.env.KIBO_API_HOST,
    baseUrl: process.env.KIBO_API_BASE_URL || 'https://home.mozu.com/',
    basePciUrl: process.env.KIBO_API_PCI_URL || 'https://pmts.mozu.com/',
    developerAccountId: process.env.KIBO_DEV_ACCOUNT_ID,
    tenant: process.env.KIBO_TENANT || process.env.KIBO_TENANT_ID,
    site: process.env.KIBO_SITE || process.env.KIBO_SITE_ID,
    catalog: process.env.KIBO_CATALOG || process.env.KIBO_CATALOG_ID,
    masterCatalog: process.env.KIBO_MASTER_CATALOG || process.env.KIBO_MASTER_CATALOG_ID,
    locale: process.env.KIBO_LOCALE,
    currency: process.env.KIBO_CURRENCY,
    developerAccount: {
      emailAddress: process.env.KIBO_USER_NAME,
      password: process.env.KIBO_USER_NAME
    }
  };
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
        if (filename) confJson = fs.readFileSync(filename, 'utf-8');
      } catch (e) {
        continue;
      }
      if (confJson) break;
    }
    if (confJson) {
      try {
        conf = Object.assign({}, JSON.parse(confJson), conf);
      } catch (e) {
        throw new Error("Configuration file was unreadable: " + e.message);
      }
    }
    if (conf.tenantPod) {
      conf.tenantPod = /https*:\/\/[^\/]+\//i.exec(conf.tenantPod + '/')[0];
      var m = /t(\d+)-s(\d+)/gmi.exec(conf.tenantPod);
      if (m) {
        conf.tenant = parseInt(m[1]);
        conf.site = parseInt(m[2]);
      } else {
        var _m = /t(\d+)/gmi.exec(conf.tenantPod);
        if (_m) {
          conf.tenant = parseInt(_m[1]);
        }
      }
    }

    if (!conf.appKey) {
      throw new Error("No configuration  found. Either set the kibo env vars , create a 'mozu.config' or 'mozu.config.json' file, or supply full config to the .client() method.");
    }
  }
  return conf;
};