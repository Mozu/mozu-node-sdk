
var Client = require('../../client');
module.exports = Client.sub({
	"orderNote": require('./returns/orderNote'),
	"package": require('./returns/package'),
	"shipment": require('./returns/shipment')
});

