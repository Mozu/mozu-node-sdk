var setupAssertions = require('./utils/setup-assertion-library');
var proxyConf = {
  plugins: [require('../plugins/fiddler-proxy')]
};

describe('Catalog service', function() {

  before(setupAssertions);
  
  this.timeout(20000);
  var opts = {
    pageSize: 5
  };

  function testClient(client) {
    return client.getProducts(opts)
      .should.eventually.have.property('items')
      .of.length(opts.pageSize);
  }

  describe('returns Products from ProductAdmin.GetProducts()', function() {
    it('in legacy require mode client.commerce()', function() {
      return testClient(require('../').client(null, proxyConf).commerce().catalog().admin().product());
    });
    it('in progressive require mode `require(\'../clients/commerce/...\')`', function() {
      return testClient(require('../clients/commerce/catalog/admin/product')(proxyConf));
    });
  })
  
});