var test = require('tape');
var jort = require('jort');
var bodyParser = require('body-parser');

var LegacySDK = require('../');
var ProductAdminClient = require(
  '../clients/commerce/catalog/admin/product');

var FiddlerProxy = require('../plugins/fiddler-proxy');

var testContext = {};
try {
  testContext = require('mozu.test.config.json');
} catch(e) {}

function testProductService(client) {
  return function(assert) {
    jort({
      pageSize: 3,
      items: [
        {},
        {},
        {}
      ]
    }).then(function(serviceUrl) {
      assert.plan(3);
      client.context.tenantPod = serviceUrl;
      client.getProducts({ pageSize: 3 }).then(function(result) {
        assert.ok(result, 'result delivered');
        assert.equal(result.pageSize, 3, 'pagesize as expected');
        assert.equal(result.items.length, 3, 'items as expected');
      }).catch(assert.fail)
    });
  }
}

test(
  'payments/publicCard returns Products from ProductAdmin.GetProducts',
  testProductService(new ProductAdminClient({ plugins: [FiddlerProxy] })));

test(
  'legacy client access still returns Products',
  testProductService(LegacySDK.client(null, { plugins: [FiddlerProxy] })
                      .commerce().catalog().admin().product()));
