'use strict';

module.exports = function streamToCallback(stream, cb) {
  var buf = '';
  stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    buf += chunk;
  });
  stream.on('error', cb);
  stream.on('end', function () {
    cb(null, buf);
  });
};