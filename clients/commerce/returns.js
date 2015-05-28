
var Client = require('../../client');
module.exports = Client.sub({
	"package": require('./returns/package'),
	"shipment": require('./returns/shipment')
});

