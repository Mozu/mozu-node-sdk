
var Client = require('../../client');
module.exports = Client.sub({
	"appliedDiscount": require('./checkouts/appliedDiscount'),
	"destination": require('./checkouts/destination'),
	"extendedProperty": require('./checkouts/extendedProperty'),
	"orderItem": require('./checkouts/orderItem'),
	"orderNote": require('./checkouts/orderNote'),
	"payment": require('./checkouts/payment')
});

