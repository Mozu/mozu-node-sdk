var setup = require('./utils/config');

describe('Commerce service', function() {

  before(setup);
  
  this.timeout(20000);
  var opts = {
    pageSize: 4
  };

  it('returns Orders from CommerceAdmin.GetOrders()', function(done) {
    return setup.client.commerce().order().getOrders(opts)
      .should.eventually.have.property('items')
      .of.length(opts.pageSize)
      .notify(done);
  });
});