
var Client = require('../../../client');
module.exports = Client.sub({
	"carrierConfiguration": require('./admin/carrierConfiguration'),
	"profiles": require('./admin/profiles'),
	"shippingProfile": require('./admin/shippingProfile')
});

