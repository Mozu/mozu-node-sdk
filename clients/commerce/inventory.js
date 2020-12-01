const Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getInventory: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/inventory/v5/inventory?responseFields={responseFields}'
	}),
	getInventoryAggregate: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/inventory/v5/inventory/aggregate?responseFields={responseFields}'
	}),
	refreshInventory: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/inventory/v5/inventory/refresh?responseFields={responseFields}'
	}),
	adjustInventory: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/inventory/v5/inventory/adjust?responseFields={responseFields}'
	}),
	getInventoryJob: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/inventory/v1/queue/{jobId}?locationCode={locationCode}&limit={limit}&types={types}&originalFilename={originalFilename}&responseFields={responseFields}'
	})
});
