
var Client = require('../../client');
module.exports = Client.sub({
	"application": require('./settings/application'),
	"checkout": require('./settings/checkout'),
	"checkoutSettings": require('./settings/checkoutSettings'),
	"general": require('./settings/general'),
	"generalSettings": require('./settings/generalSettings'),
	"locationUsage": require('./settings/locationUsage'),
	"shipping": require('./settings/shipping'),
	"siteShippingSettings": require('./settings/siteShippingSettings')
});

