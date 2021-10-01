'use strict';

var zlib = require('zlib');

function getDecompressor(encoding) {
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
  var responseContent = stream;

  var decompressor = getDecompressor(stream.headers['content-encoding']);
  if (decompressor !== null) {
    stream.pipe(decompressor);
    responseContent = decompressor;
  }
  let chunks = []
  responseContent.on('data', function (chunk) {
    chunks.push(chunk);
  });
  responseContent.on('error', cb);
  responseContent.on('end', function (chunk) {
    if(chunk){
      chunks.push(chunk);
    }
    cb(null, Buffer.concat(chunks).toString());
  });
};