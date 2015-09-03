var setupChai = require('./utils/setup-assertion-library');
var proxyConf = {
  plugins: [require('../plugins/fiddler-proxy')]
};
var express = require('express');
var bodyParser = require('body-parser');


describe('Payment Card Service', function() {

  var opts;
  var client;
  var mock;

  before(function() {
    setupChai();
    this.timeout(20000);
    opts = {
      cvv: "123",
      cardType: "visa",
      expireMonth: "11",
      expireYear: "2019",
      cardHolderName: "Demo User",
      cardNumber: "4111111111111111",
      cardIssueMonth: "01",
      cardIssueYear: "14"
    };

    client = require('../clients/commerce/payments/publicCard')(proxyConf);
    client.context.basePciUrl = "http://localhost:8009/"

  });


  

  it('sends card data to Commerce.Payments.publicCard.Cards via basePCIUrl', function(done) {

    mock = express();

    mock.use(bodyParser.json());

    mock.post('/payments/commerce/payments/cards/', function(req, res) {
      req.body.should.have.property('cardNumber').that.equals('4111111111111111');
      res.json({
        id: '123456'
      });
    });

    mock.listen(8009);

    return client.create(opts)
      .should.eventually.have.property('id')
      .notify(done);
  });
  
});