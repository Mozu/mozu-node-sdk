
var Client = require('../client');
module.exports = Client.sub({
	"eventNotification": require('./event/eventNotification'),
	"push": require('./event/push')
});

