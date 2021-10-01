'use strict';

var Stream = require('stream').Transform;
var zlib = require('zlib');

function getDecompressor (encoding) {
  switch (encoding) {
    case 'br':
      return zlib.createBrotliDecompress();
    case 'gzip':
      return zlib.createGunzip();
    default:
      return null;
  }
}

module.exports = function streamToCallback(stream, cb) {
  var decompressor = getDecompressor(stream.headers['content-encoding']);
  if (decompressor !== null) stream.pipe(decompressor);
  var buf = new Stream();
  //stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    buf.push(chunk);
  });
  stream.on('error', cb);
  stream.on('end', function () {
    cb(null, buf.read().toString('base64'));
  });
};