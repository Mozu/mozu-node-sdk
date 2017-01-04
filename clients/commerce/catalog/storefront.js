
var Client = require('../../../client');
module.exports = Client.sub({
	"category": require('./storefront/category'),
	"orderTaxContext": require('./storefront/orderTaxContext'),
	"priceList": require('./storefront/priceList'),
	"product": require('./storefront/product'),
	"productSearchResult": require('./storefront/productSearchResult'),
	"shipping": require('./storefront/shipping')
});

