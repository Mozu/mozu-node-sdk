
var Client = require('../../../client');
module.exports = Client.sub({
	"customerCheckoutSettings": require('./checkout/customerCheckoutSettings'),
	"orderProcessingSettings": require('./checkout/orderProcessingSettings'),
	"paymentSettings": require('./checkout/paymentSettings')
});

