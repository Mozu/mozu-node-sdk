
var Client = require('../../../client');
module.exports = Client.sub({
	"attributedefinition": require('./admin/attributedefinition'),
	"category": require('./admin/category'),
	"couponSet": require('./admin/couponSet'),
	"couponsets": require('./admin/couponsets'),
	"discount": require('./admin/discount'),
	"discounts": require('./admin/discounts'),
	"facet": require('./admin/facet'),
	"locationInventory": require('./admin/locationInventory'),
	"masterCatalog": require('./admin/masterCatalog'),
	"priceList": require('./admin/priceList'),
	"pricelists": require('./admin/pricelists'),
	"product": require('./admin/product'),
	"productReservation": require('./admin/productReservation'),
	"products": require('./admin/products'),
	"publishingScope": require('./admin/publishingScope'),
	"search": require('./admin/search'),
	"softAllocation": require('./admin/softAllocation')
});

