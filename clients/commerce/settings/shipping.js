
var Client = require('../../../client');
module.exports = Client.sub({
	"siteShippingHandlingFee": require('./shipping/siteShippingHandlingFee')
});

