
var Client = require('../../../../client');
module.exports = Client.sub({
	"handlingFeeRule": require('./profiles/handlingFeeRule'),
	"shippingInclusionRule": require('./profiles/shippingInclusionRule'),
	"shippingStates": require('./profiles/shippingStates')
});

