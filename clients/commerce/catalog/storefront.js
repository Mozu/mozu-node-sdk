
var Client = require('../../../client');
module.exports = Client.sub({
	"category": require('./storefront/category'),
	"product": require('./storefront/product'),
	"productSearchResult": require('./storefront/productSearchResult'),
	"shipping": require('./storefront/shipping')
});

