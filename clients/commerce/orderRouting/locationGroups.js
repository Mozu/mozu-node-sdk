const Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getGroup: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}_orderRouting/api/v1/group/{groupId}?responseFields={responseFields}'
	}),
	deleteGroup: Client.method({
		method: constants.verbs.DELETE,
		url: '{+tenantPod}_orderRouting/api/v1/group/{groupId}'
	}),
	createGroup: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}_orderRouting/api/v1/group/?responseFields={responseFields}'
    }),
    setGroupSorts: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}_orderRouting/api/v1/group/{groupId}/setSorts?responseFields={responseFields}'
    }),
	updateGroup: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}_orderRouting/api/v1/group/{groupId}?responseFields={responseFields}'
	})
});
