
var Client = require('../../../../client');
module.exports = Client.sub({
	"assignedDiscount": require('./couponsets/assignedDiscount'),
	"coupon": require('./couponsets/coupon')
});

