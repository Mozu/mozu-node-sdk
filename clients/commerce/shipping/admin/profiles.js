
var Client = require('../../../../client');
module.exports = Client.sub({
	"handlingFeeRule": require('./profiles/handlingFeeRule'),
	"orderHandlingFeeRules": require('./profiles/orderHandlingFeeRules'),
	"productHandlingFeeRules": require('./profiles/productHandlingFeeRules'),
	"shippingInclusionRule": require('./profiles/shippingInclusionRule'),
	"shippingStates": require('./profiles/shippingStates')
});

