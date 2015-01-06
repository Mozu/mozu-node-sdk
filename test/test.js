var chai = require('chai'),
    client = require('../src/init').client(),
    testConfig = require('./utils/config');

chai.should();
chai.use(require('chai-as-promised'));

client.setTenant(testConfig.tenant);
client.setMasterCatalog(testConfig.masterCatalog);

if (process.env.USE_FIDDLER) {
  console.log('using fiddler proxy')
  client.defaultRequestOptions = {
    proxy: "http://127.0.0.1:8888",
    strictSSL: false
  };
}

describe('the Mozu JavaScript SDK', function() {
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  describe('Catalog service', function() {
    it('returns Products from ProductAdmin.GetProducts()', function(done) {
      return client.commerce().catalog().admin().product().getProducts(opts)
        .should.eventually.have.property('items')
        .of.length(opts.pageSize)
        .notify(done);
    });
  });
  describe('Commerce service', function() {
    it('returns Orders from CommerceAdmin.getOrders()', function(done) {
      opts.pageSize--;
      return client.commerce().order().getOrders(opts)
        .should.eventually.have.property('items')
        .of.length(opts.pageSize)
        .notify(done);
    });
  });
  describe('Content service', function() {
    it('returns DocumentLists from Content.getDocumentLists()', function() {
      return client.content().documentList().getDocumentLists().should.eventually.be.ok;
    });
  });
});