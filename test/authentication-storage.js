'use strict';
var test = require('tape');
var path = require('path');
var fs = require('fs');
var FILENAME = ".mozu.authentication-cache.json";
var HOMEDIR = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var cacheFileName = path.join(HOMEDIR, FILENAME);

var ProductClient = require('../clients/commerce/catalog/admin/product');
var Multipass = require('mozu-multipass');
var FiddlerProxy = require('../plugins/fiddler-proxy');

var timesCalled = 0;

var client = ProductClient({
  plugins: [Multipass, FiddlerProxy]
});

var oldGet = client.authenticationStorage.get;
client.authenticationStorage.get = function() {
  timesCalled++;
  oldGet.apply(this, arguments);
}

test(
  'authentication storage plugin sets client.authenticationStorage property', 
  { timeout: 20000 },
  function(assert) {
    assert.plan(1);
    assert.equal(client.authenticationStorage.constructor.name, 'Multipass',
      'constructor is named Multipass');
  }
);

test(
  'transparently authenticates with a typical call to Products',
  { timeout: 20000 },
  function(assert) {
    assert.plan(4);
    client.getProducts({ pageSize: 1 }).then(function() {
      fs.readFile(cacheFileName, 'utf8', function(err, contents) {
        assert.error(err, cacheFileName + " exists");
        assert.ok(timesCalled > 0, "authentication  Storage.get was called");
        assert.ok(contents, 'file has contents');
        assert.doesNotThrow(function() {
          JSON.parse(contents);
        }, 'file contents are now json');
      })
    })
  }
)
