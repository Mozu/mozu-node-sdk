
var Client = require('../../client');
module.exports = Client.sub({
	"application": require('./settings/application'),
	"cartSettings": require('./settings/cartSettings'),
	"checkout": require('./settings/checkout'),
	"checkoutSettings": require('./settings/checkoutSettings'),
	"fulfillmentSettings": require('./settings/fulfillmentSettings'),
	"general": require('./settings/general'),
	"generalSettings": require('./settings/generalSettings'),
	"locationUsage": require('./settings/locationUsage'),
	"returnSettings": require('./settings/returnSettings'),
	"shipping": require('./settings/shipping'),
	"siteShippingSettings": require('./settings/siteShippingSettings')
});

