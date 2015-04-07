var fs = require('fs');
var path = require('path');
var FILENAME = ".mozu.authentication-cache.json";
var HOMEDIR = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var cacheFileName = path.join(HOMEDIR, FILENAME);

describe('External authentication storage', function() {

  var client;
  before(function() {
    var chai = require('chai');
    chai.should();
    chai.use(require('chai-as-promised'));

    client = require('../src/init').client(null, {
      plugins: {
        authenticationStorage: require('mozu-multipass')()
      }
    });

  });
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  it('returns Products from ProductAdmin.GetProducts()', function(done) {
    client.commerce().catalog().admin().product().getProducts(opts).then(function() {
      (function() { fs.readFileSync(cacheFileName, 'utf8') }).should.not.throw;
      done();
    });
  });
  
});