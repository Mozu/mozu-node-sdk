'use strict';

var hashStream = require('./hash-stream'),
    concat = require('concat-stream'),
    constants = require('../constants'),
    util = require('util'),
    defaultTimeout = constants.capabilityTimeoutInSeconds;

module.exports = function isRequestValid(context, req, cb) {
  var timeout = context.capabilityTimeoutInSeconds || defaultTimeout;
  var headers = req.headers,
      body = JSON.stringify(req.body),
      requestDate = new Date(headers.date),
      currentDate = new Date(),
      diff = (currentDate - requestDate) / 1000;

  req.pipe(hashStream(context.sharedSecret, headers.date, body)).pipe(concat(function (hash) {
    if (hash !== headers[constants.headerPrefix + constants.headers['SHA256']] || diff > timeout) {
      return cb(new Error(util.format("Unauthorized access from %s, %s, %s Computed: %s", headers.host, headers[constants.headerPrefix + constants.headers['SHA256']], headers.date, hash)));
    } else {
      return cb(null);
    }
  }));
};