
var Client = require('../../../client');
module.exports = Client.sub({
	"customerCheckoutSettings": require('./checkout/customerCheckoutSettings'),
	"paymentSettings": require('./checkout/paymentSettings')
});

