const Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getRoutingCandidates: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}_orderRouting/api/v1/routing/candidates?responseFields={responseFields}'
	}),
	getRoutingSuggestions: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}_orderRouting/api/v1/routing/suggestion?responseFields={responseFields}'
	})
});
