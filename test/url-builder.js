var setup = require('./utils/config');

describe('URL builder', function() {

  before(setup);
  
  this.timeout(20000);
  var opts = {
    cvv: "123",
    cardType: "visa",
    expireMonth: "11",
    expireYear: "19",
    cardHolderName: "Demo User",
    cardIssueNumber: "4111111111111111",
    cardIssueMonth: "01",
    cardIssueYear: "14"
  };

  it('provides an informative error if your client context does not include a required base url', function() {
    var client = setup.client.commerce().payments().publicCard();
    delete client.context.basePciUrl;
    return client.create(opts)
      .should.be.rejectedWith('Could not make URL from template {+pciPod}api/commerce/payments/cards/. Your context is missing a pciPod.')
  });
  
});
