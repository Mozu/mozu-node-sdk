
var Client = require('../../../client');
module.exports = Client.sub({
	"eventDeliverySummary": require('./subscriptions/eventDeliverySummary')
});

