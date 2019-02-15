
var Client = require('../../../client');
module.exports = Client.sub({
	"attributedefinition": require('./admin/attributedefinition'),
	"category": require('./admin/category'),
	"couponSet": require('./admin/couponSet'),
	"couponsets": require('./admin/couponsets'),
	"currencyLocalization": require('./admin/currencyLocalization'),
	"discount": require('./admin/discount'),
	"discounts": require('./admin/discounts'),
	"discountSettings": require('./admin/discountSettings'),
	"facet": require('./admin/facet'),
	"locationInventory": require('./admin/locationInventory'),
	"masterCatalog": require('./admin/masterCatalog'),
	"priceList": require('./admin/priceList'),
	"pricelists": require('./admin/pricelists'),
	"product": require('./admin/product'),
	"productReservation": require('./admin/productReservation'),
	"products": require('./admin/products'),
	"productSortDefinition": require('./admin/productSortDefinition'),
	"publishingScope": require('./admin/publishingScope'),
	"search": require('./admin/search'),
	"softAllocation": require('./admin/softAllocation')
});

