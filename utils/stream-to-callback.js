module.exports = function streamToCallback(stream, cb) {
  var buf = '';
  stream.setEncoding('utf8');
  stream.on('readable', function() {
    var chunk;
    while (null !== (chunk = stream.read())) {
      buf += chunk;
    }
  });
  stream.on('error', cb);
  stream.on('end', function() {
    cb(null, buf)
  });
}