var setupChai = require('./utils/setup-assertion-library');
var proxyConf = {
  plugins: [require('../plugins/fiddler-proxy')]
};

describe('Payment Card Service', function() {

  before(setupChai);
  
  this.timeout(20000);
  var opts = {
    cvv: "123",
    cardType: "visa",
    expireMonth: "11",
    expireYear: "2019",
    cardHolderName: "Demo User",
    cardNumber: "4111111111111111",
    cardIssueMonth: "01",
    cardIssueYear: "14"
  };

  it('returns CardId from Commerce.Payments.publicCard.Cards', function(done) {
    return require('../clients/commerce/payments/publicCard')(proxyConf).create(opts)
      .should.eventually.have.property('id')
      .notify(done);
  });
  
});