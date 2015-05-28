
var Client = require('../../client');
module.exports = Client.sub({
	"adjustment": require('./orders/adjustment'),
	"appliedDiscount": require('./orders/appliedDiscount'),
	"attributedefinition": require('./orders/attributedefinition'),
	"billingInfo": require('./orders/billingInfo'),
	"digitalPackage": require('./orders/digitalPackage'),
	"extendedProperty": require('./orders/extendedProperty'),
	"fulfillmentAction": require('./orders/fulfillmentAction'),
	"fulfillmentInfo": require('./orders/fulfillmentInfo'),
	"orderAttribute": require('./orders/orderAttribute'),
	"orderItem": require('./orders/orderItem'),
	"orderNote": require('./orders/orderNote'),
	"orderValidationResult": require('./orders/orderValidationResult'),
	"package": require('./orders/package'),
	"payment": require('./orders/payment'),
	"pickup": require('./orders/pickup'),
	"refund": require('./orders/refund'),
	"shipment": require('./orders/shipment')
});

