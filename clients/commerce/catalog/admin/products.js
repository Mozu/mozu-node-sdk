
var Client = require('../../../../client');
module.exports = Client.sub({
	"locationInventory": require('./products/locationInventory'),
	"productExtra": require('./products/productExtra'),
	"productOption": require('./products/productOption'),
	"productProperty": require('./products/productProperty'),
	"productVariation": require('./products/productVariation')
});

