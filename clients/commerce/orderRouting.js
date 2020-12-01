
const Client = require('../../client');
module.exports = Client.sub({
	"dataLists": require('./orderRouting/dataLists'),
	"filters": require('./orderRouting/filters'),
	"locationGroups": require('./orderRouting/locationGroups'),
	"routingCandidates": require('./orderRouting/routingCandidates')
});