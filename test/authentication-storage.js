'use strict';
var test = require('tape');
var jort = require('jort');
var sinon = require('sinon');
var testContext = require('./_test-context');

var ProductClient = require('../clients/commerce/catalog/admin/product');
var Multipass = require('mozu-multipass');


var getClient = function(plugins) {
  var client = ProductClient({
    context: testContext,
    plugins: plugins
  });
  return {
    client: client,
    authGet: sinon.spy(client.authenticationStorage, 'get'),
    authSet: sinon.spy(client.authenticationStorage, 'set')
  };
}

test(
  'authentication storage plugin sets client.authenticationStorage property', 
  function(assert) {
    assert.plan(1);
    assert.equal(
      getClient([Multipass]).client.authenticationStorage.constructor.name,
      'Multipass',
      'constructor is named Multipass'
    );
  }
);

test(
  'transparently authenticates with a typical call to Products',
  { timeout: 20000 },
  function(assert) {
    assert.plan(5);
    jort.steps([
      {
        accessToken: 'app'
      },
      {
        items: [],
        totalCount: 0
      }
    ]).then(function(url) {
      var c = getClient();
      c.client.context.baseUrl = c.client.context.tenantPod = url;
      c.client.getProducts({ pageSize: 1 }).then(function(products) {
        assert.ok(
          c.authGet.calledOnce,
          'authentication Storage.get was called exactly once'
        );
        assert.ok(
          c.authGet.calledBefore(c.authSet),
          'before authentication Storage.set was called'
        );
        assert.ok(
          c.authSet.calledOnce,
          'authentication Storage.set was called exactly once'
        );
        assert.deepEqual(
          c.authSet.firstCall.args[2],
          {
            accessToken: 'app',
          },
          'with app token'
        );
        assert.ok(
          products.hasOwnProperty('items') &&
            products.hasOwnProperty('totalCount'),
            'final call complete'
        );
      });
    });
  }
)
