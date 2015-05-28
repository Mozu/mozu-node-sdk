var setupAssertions = require('./utils/setup-assertion-library');

describe('Commerce service', function() {

  before(setupAssertions);
  
  this.timeout(20000);
  var opts = {
    pageSize: 4
  };

  function testClient(client) {
    return client.getOrders(opts)
      .should.eventually.have.property('items')
      .of.length(opts.pageSize);
  }

  describe('returns Orders from CommerceAdmin.GetOrders()', function() {

    it('in legacy require mode client.commerce()', function() {
      return testClient(require('../').client().commerce().order());
    });
    it('in progressive require mode `require(\'../clients/commerce/...\')`', function() {
      return testClient(require('../clients/commerce/order')());
    });
  });
});