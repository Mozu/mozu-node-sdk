var setupAssertions = require('./utils/setup-assertion-library');

describe('Catalog service', function() {

  before(setupAssertions);
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  it('returns Products from ProductAdmin.GetProducts()', function(done) {
    var client = require('../clients/commerce/catalog/admin/product')();
    client.getProducts(opts)
      .should.eventually.have.property('items')
      .of.length(opts.pageSize)
      .notify(done);
  });
  
});