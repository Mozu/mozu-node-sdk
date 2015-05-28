
var Client = require('../../../../../client');
module.exports = Client.sub({
	"productTypeExtra": require('./producttypes/productTypeExtra'),
	"productTypeOption": require('./producttypes/productTypeOption'),
	"productTypeProperty": require('./producttypes/productTypeProperty'),
	"productTypeVariation": require('./producttypes/productTypeVariation')
});

