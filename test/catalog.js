var setup = require('./utils/config');

describe('Catalog service', function() {

  before(setup);
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  it('returns Products from ProductAdmin.GetProducts()', function(done) {
    return setup.client.commerce().catalog().admin().product().getProducts(opts)
      .should.eventually.have.property('items')
      .of.length(opts.pageSize)
      .notify(done);
  });
  
});