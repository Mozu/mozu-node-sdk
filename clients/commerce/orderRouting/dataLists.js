const Client = require('../../client'), constants = Client.constants;

module.exports = Client.sub({
	getDataList: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/dataList/{dataListId}?responseFields={responseFields}'
	}),
	deleteDataList: Client.method({
		method: constants.verbs.DELETE,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/dataList/{dataListId}'
	}),
	createDataList: Client.method({
		method: constants.verbs.POST,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/dataList/?responseFields={responseFields}'
	}),
	updateDataList: Client.method({
		method: constants.verbs.PUT,
		url: '{+tenantPod}api/commerce/orders/orderRouting/api/v1/dataList/{dataListId}?responseFields={responseFields}'
	})
});
