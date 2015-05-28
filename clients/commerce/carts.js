
var Client = require('../../client');
module.exports = Client.sub({
	"appliedDiscount": require('./carts/appliedDiscount'),
	"cartItem": require('./carts/cartItem'),
	"changeMessage": require('./carts/changeMessage'),
	"extendedProperty": require('./carts/extendedProperty')
});

