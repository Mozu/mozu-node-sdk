const Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getFilter: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/filter/{filterId}?responseFields={responseFields}'
	}),
	deleteFilter: Client.method({
		method: constants.verbs.DELETE,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/filter/{filterId}'
	}),
	createFilter: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/filter/?responseFields={responseFields}'
	}),
	updateFilter: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/filter/{filterId}?responseFields={responseFields}'
	})
});
