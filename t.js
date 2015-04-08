process.env.mozuHosted = {
    sdkConfig: {
        baseUrl: "http://foo",
        tenantPod: "http://bar"
    }
};

console.log(typeof process.env.mozuHosted);
process.exit(1)

var client = require('mozu-node-sdk').client();

client.defaultRequestOptions = {
    proxy: 'http://127.0.0.1:8888',
    rejectUnauthorized: false
};

client.context.tenant = 1234;

function log(result) {
    console.log('success', result);

}

function reportError(error) {
    console.error(error.message, error);

}

console.dir(client.context);

var c = client.commerce().catalog().admin().product();

console.dir(c.context);

client.commerce().catalog().admin().product().getProducts({
    filter: 'categoryId req 123'
}).then(log, reportError);