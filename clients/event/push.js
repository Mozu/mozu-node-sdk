
var Client = require('../../client');
module.exports = Client.sub({
	"subscription": require('./push/subscription'),
	"subscriptions": require('./push/subscriptions')
});

