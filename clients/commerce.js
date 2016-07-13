
var Client = require('../client');
module.exports = Client.sub({
	"admin": require('./commerce/admin'),
	"cart": require('./commerce/cart'),
	"carts": require('./commerce/carts'),
	"catalog": require('./commerce/catalog'),
	"channel": require('./commerce/channel'),
	"channelGroup": require('./commerce/channelGroup'),
	"customer": require('./commerce/customer'),
	"inStockNotificationSubscription": require('./commerce/inStockNotificationSubscription'),
	"location": require('./commerce/location'),
	"order": require('./commerce/order'),
	"orders": require('./commerce/orders'),
	"payments": require('./commerce/payments'),
	"return": require('./commerce/return'),
	"returns": require('./commerce/returns'),
	"settings": require('./commerce/settings'),
	"shipping": require('./commerce/shipping'),
	"targetRule": require('./commerce/targetRule'),
	"wishlist": require('./commerce/wishlist'),
	"wishlists": require('./commerce/wishlists')
});

