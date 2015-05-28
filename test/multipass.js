var fs = require('fs');
var path = require('path');
var FILENAME = ".mozu.authentication-cache.json";
var HOMEDIR = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var cacheFileName = path.join(HOMEDIR, FILENAME);
var chai = require('chai');
var should = chai.should();
chai.use(require('chai-as-promised'));

describe('External authentication storage', function() {

  var client;
  var timesCalled = [];

  before(function() {

    client = require('../').client(null, {
      plugins: [require('mozu-multipass')]
    }).commerce().catalog().admin().product();

    var oldGet = client.authenticationStorage.get;
    client.authenticationStorage.get = function() {
      timesCalled.push(new Date(), Array.prototype.slice.call(arguments));
      oldGet.apply(this, arguments);
    }


  });
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  it("exists at the authenticationStorage property if passed in as a plugin", function() {
    client.authenticationStorage.constructor.name.should.equal("Multipass");
  });

  it('successfully authenticates with a typical call to Products', function(done) {
    return client.getProducts(opts).then(function() {
      fs.readFile(cacheFileName, 'utf-8', function(err, contents) {
        timesCalled.length.should.be.above(0);
        should.not.exist(err);
        should.exist(contents);
        JSON.parse(contents).should.be.an('object');
        done();
      });
    });
  });
  
});