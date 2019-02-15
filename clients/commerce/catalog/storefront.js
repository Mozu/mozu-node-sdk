
var Client = require('../../../client');
module.exports = Client.sub({
	"autoAddDiscountTarget": require('./storefront/autoAddDiscountTarget'),
	"category": require('./storefront/category'),
	"currencyExchangeRate": require('./storefront/currencyExchangeRate'),
	"orderTaxContext": require('./storefront/orderTaxContext'),
	"priceList": require('./storefront/priceList'),
	"product": require('./storefront/product'),
	"productSearchResult": require('./storefront/productSearchResult'),
	"shipping": require('./storefront/shipping')
});

