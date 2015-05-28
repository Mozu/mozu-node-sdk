var setupChai = require('./utils/setup-assertion-library');
var when = require('when');

describe('Platform service', function() {

  before(setupChai);
  
  this.timeout(20000);

  it('returns a Tenant from GetTenant', function(done) {

    var tenant = setup.client.platform().tenant().getTenant({
      tenantId: setup.client.context.tenant
    });

    when.join(
      tenant.should.eventually.have.property('domain'),
      tenant.should.eventually.have.property('id',setup.client.context.tenant),
      tenant.should.eventually.have.property('sites').should.eventually.have.property('length')
    ).should.notify(done);

  });
});