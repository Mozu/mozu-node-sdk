# Mozu Node SDK

The Mozu Node SDK provides a NodeJS API for connecting to Mozu web services.

## Usage

Full reference documentation is available in the form of the [REST Resources](http://developer.mozu.com/resources/) section in the Mozu Developer Center. The Node SDK has methods for each one of the resources listed here. Below is a quick getting-started guide.

### Getting an API Client

You may pass configuration into the client factory directly:

```js
var client = require('mozu-node-sdk/clients/platform/application')({
    context: {
        "appKey": "00000",
        "sharedSecret": "9864c0520cc0468397faa37600f1f110",
        "baseUrl": "https://home.mozu.com/",
        "basePciUrl" : "https://crds.mozu.com/"
        "developerAccountId": "001",
        "developerAccount": {
            "emailAddress": "example@volusion.com",
            "password": "Password123!"
        }
    }
});
```

Or, if you have a JSON file in your working directory called `mozu.config.json` or `mozu.config`, the SDK will attempt to read configuration out of that instead, and you can call the client factory with no arguments.

In order to access different features of the API, use `require()` to pull in a client, and pass it your existing client instance in order to preserve context.

```js
var appsClient = require('mozu-node-sdk/clients/platform/application')();

client.context.tenant = 1234;

var productClient = require('mozu-node-sdk/clients/commerce/catalog/admin/product')(appsClient);
// this will preserve the tenant you added to the prior context

function log(result) {
    console.log(util.inspect(result));
}

function reportError(error) {
    console.error(error.message, error);
}

productClient.getProducts({
    filter: 'categoryId req 123'
}).then(log, reportError);
```


### Modifying Context

A full context is necessary before making calls. The Mozu API needs requests to have a full collection of context headers before it will respond to requests. You can load context initially when creating a client, but you can also modify context on an existing client by simply updating the values in the `client.context` object.

Some of the context is necessary in order to bootstrap your Mozu authentication:
 - `client.context['appKey']`: The key for the Mozu application that the client will use for auth when it sends API requests. The default authentication provider will use this application key when it's trying to get its initial set of app claims. A new client will do this silently, prior to its first API call, and then it manages, reuses, and refreshes those app claims as necessary for ensuing calls.
 - `client.context['sharedSecret']`: The shared secret for the Mozu application that the client will use for auth when it sends API requests. The default authentication provider will use this shared secret when it's trying to get its initial set of app claims. A new client will do this silently, prior to its first API call, and then it manages, reuses, and refreshes those app claims as necessary for ensuing calls.
 - `client.context['baseUrl']`: The base URL (usually just a domain name) representing the "home pod" for the Mozu API. **For all production and sandbox uses, this will be https://home.mozu.com/. ** For different Mozu environments (such as internal integration and staging environments), this domain will differ. This is the "bootstrap" domain; the SDK knows how to retrieve the domains for your tenants by calling the services on this domain.
 - `client.context['basePciUrl']`: To comply with Payment Card Industry (PCI) rules, Mozu hosts its PaymentService, which stores credit card data, on separate hardware from the rest of its systems. If your client will need to talk directly to the PaymentService (which is rare unless you're doing actual transaction processing) then you will need to add this domain to your context configuration. It may differ based on your individual tenant configuration; Mozu Support will provide you with yours.
 - `client.context['tenantPod']`: The base domain for tenant-related API calls (that is, all calls that access actual tenant data). Normally, the client will call the TenantService on the home pod to find this URL, before placing tenant calls, so all you need to specify in the context is the `tenantId`. If you know ahead of time what tenant your code will need to access, then you can hardcode the tenant pod URL in your context.
 - `client.context['developerAccount']`: An object with an `emailAddress` property and a `password` property, that the client will use when trying to authenticate to services that require developer login, such as the AppDev file sync services. **Do not hardcode your password in a file!** If you need persistent authentication, we recommend using an AuthenticationStorage plugin such as [Multipass][1].
 - `client.context['developerAccountId']`: A unique ID for the particular Developer Account context that your developer user should use when contacting App Dev. Unless you are talking to the App Dev services it should not be necessary; you can look it up by examining the numbers next to your developer account link in the Mozu Launchpad immediately after login.
 - `client.context['adminUser']`: An object with an `emailAddress` property and a `password` property, that the client will use when trying to authenticate to services that require an admin user, such as SiteSettings. **Do not hardcode your password in a file!** If you need persistent authentication, we recommend using an AuthenticationStorage plugin such as [Multipass][1].

The following context values will be sent as HTTP request headers when they are present. 
 - `client.context['app-claims']`: The claims header for your associated Application. The SDK manages its own authentication, so you should rarely have to use this as long as you have it in your configuration. Required for all calls. You can initialize a client with app claims by passing `appClaims` in the context.
 - `client.context['user-claims']`: The claims header for your associated user. The SDK manages its own authentication, so you should rarely have to use this as long as you have it in your configuration. Required for many calls. You can initialize a client with user claims by passing `userClaims` in the context.
 - `client.context['tenant']`: The tenant ID, for scoping calls to a tenant. Required at minimum for all calls to services outside the Home Pod; `tenant` is the outermost scope. You can initialize a client with a tenant ID by passing `tenantId` in the context.
 - `client.context['site']`: The site ID, for scoping calls to a site. You can initialize a client with a site ID by passing `siteId` in the context.
 - `client.context['master-catalog']`: The master catalog ID, for scoping calls to a master catalog. You can initialize a client with a master catalog ID by passing `masterCatalogId` in the context.
 - `client.context['catalog']`: The catalog ID, for scoping calls to a catalog. You can initialize a client with a catalog ID by passing `catalogId` in the context.
 - `client.context['dataview-mode']`: The data view mode for a call. This can be either `LIVE` (default) or `PENDING`. A data view mode of `PENDING` will show staged changes as if they are live. You can initialize a client with a data view mode by passing `dataviewMode` in the context.

You can also store arbitrary data on the context, and it will be passed around to the various clients you create. This can be useful for login information, common state, or secret keys.

### Navigating Sections

Use `require()` to navigate the directory structure of the SDK. Each directory will return a constructor for creating a client with the relevant methods.
```js
var cartClient = require('mozu-node-sdk/commerce/cart')()
```

Share context between clients by passing client instances to each others' constructors.
```js
var productSearchClient = require('mozu-node-sdk/commerce/catalog/storefront/productSearchResult')(cartClient);
```

#### Legacy Interface

**Prior to the 1.17 release, the only way to traverse the service graph was to call each layer as a function, e.g. `client.commerce().catalog().admin().product()`. This interface still works, but we recommend the direct requires; they are faster, and when bundling for code actions, the direct requires result in much smaller bundles.**

In the legacy interface, the client object has subsections for each service, and sub-properties for each method. In order to preserve client context, navigate the object tree of sections by calling each one as a function. This passes and preserves context between the API clients.

```js
// WRONG
client.commerce.catalog.admin.product.getProducts();
// RIGHT
client.commerce().catalog().admin().product().getProducts();
```

If you're running a lot of calls from a particular service area, you can store that section in a local variable:
```
var productAdminClient = client.commerce().catalog().admin().product();
productAdminClient.getProducts();
productAdminClient.updateProductInCatalogs(payload, opts);
```

### Making Calls
All of the API methods take two arguments: a `body` to use as POST data or URL parameters, and a set of `options` to specify the scope of the request (i.e. what kind of claims to use, whether to include a Site header or just a Tenant header, and other properties).

```js
require('mozu-node-sdk/clients/content/documentlists/document')().getDocuments({
    pageSize: 5,
    documentListName: 'files@mozu'
});
```

The `options` argument is optional, but consists of any option that can be passed to the underlying Node `http` client, or other special options described below.

```js
require('mozu-node-sdk/clients/content/documentlists/document')().getDocuments({
    pageSize: 5,
    documentListName: 'files@mozu'
}, {
    timeout: 60000
});
```

#### Other Options

 - `parseDates` *(Boolean)* Parse ISO 8601 dates in the Mozu API JSON responses into native JavaScript dates. This option uses regular expressions and slows down JSON parsing by a small (linear) amount. It defaults to `true`. If you're having performance problems, you can set it to `false` for one call or in your `defaultRequestOptions` for all calls.

 - `context` *(Object)* Override the current client context for the duration of one call.
   ```js
   require('mozu-node-sdk/clients/content/documentlists/document')().getDocuments({
       pageSize: 5,
       documentListName: 'files@mozu'
   }, {
       context: {
           site: 6789
       }
   });
   ```

You can set the `defaultRequestOptions` property of your client object for certain options to be passed in to every request.
```js
client.defaultRequestOptions = {
  rejectUnauthorized: false
};
```

You can set these defaults for all client objects by calling the `setDefaultRequestOptions()` method on the SDK itself.
```js
require('mozu-node-sdk').setDefaultRequestOptions({
    rejectUnauthorized: true
});
```

### Handling Responses

All API calls return a Promise, specifically either a native Promise where available, or a [When](https://github.com/cujojs/when) Promise. Promises are one of the most standard and popular ways of handling asynchronous code in JavaScript. The Promise represents an "eventual value". It's an object which is either pending, resolved (success) or rejected (failure). You can attach handlers to it using the standard `.then(onResolved, onRejected)` method.

Crucially, promises can be chained. Inside a promise handler, you can return a promise in order to produce a promise that will only resolve once both the inner and outer promise have.

```js
// get a customer ID from an order and then get all orders for that customer
var orderClient = require('mozu-node-sdk/clients/commerce/order');
orderClient.getOrder({ orderId: 'ab96c79e59b79a76' }).then(function(order) {
   return orderClient.getOrders({
    filter: "CustomerId eq " + order.customerAccountId
   })
}).then(function(orders) {
    // orders will be a list of orders for the customer of the first order
});
```

The Mozu Node SDK will use native Promises when available, and will use the [When ES6 shim](https://github.com/cujojs/when/blob/master/docs/es6-promise-shim.md) otherwise.
This guarantees that the global `Promise` constructor will be available. That constructor has static methods which can manipulate promises. This can be useful for higher-order promise tasks, such as joining multiple promises together into a single result.

```js
// get a fully-hydrated customer from an order and add all orders for that customer
var customerAccountClient = require('mozu-node-sdk/clients/commerce/customer/customerAccount')(orderClient);
function joinCustomerAndOrdersFromOrder(order) {
   return Promise.all([
    orderClient.getOrders({
      filter: "CustomerId eq " + order.customerAccountId
   }),
    customerAccountClient.getAccount({
      accountId: order.customerAccountId
   })]);
}

orderClient.getOrder({ orderId: 'ab96c79e59b79a76' })
  .then(joinCustomerAndOrdersFromOrder).then(function(results) {
    var orders = results[0], customer = results[1];
    // orders will be a list of orders for the customer,
    // customer will be the full customer object
    console.log("Customer:", customer)
    console.log("Orders:", orders)
}, function() {
    console.error("Request failed");
});
```

### Plugins

#### Authentication Storage

Client factory methods can accept other configurations besides `context`. One such configuration property is `plugins`, which must be an array of functions that transform a client. One supported plugin type is `AuthenticationStorage`. An AuthenticationStorage plugin must supply an `authenticationStorage` property to an SDK client.

```js
// `null` to fetch context from a local config file
var persistentAuthClient = require('mozu-node-sdk/clients/platform/applications')({
  plugins: [customAuthStorageObject]
});
```

The SDK will call this object to store and retrieve auth tickets. It must be a function that receives a client as its argument, and returns an object that implements the following methods, both asynchronous:

##### `AuthenticationStorage.get(claimType, context, callback)`
Retrieve a stored auth ticket. Should never return tickets whose refresh tokens have expired.
**Arguments:**
 - `claimType` *(String)* A string representing the type of ticket to retrieve. Can be one of the following strings:
    - `"platform"` -- an app claim for your application
    - `"developer"` -- a user claim for a developer account to use Platform services
    - `"admin-user"` -- a user claim for an administrator to work with tenant data
 - `context` *(Object)* The context object your client includes. This context is required to calculate a unique key for the stored ticket.
 - `callback` *(Function)* A callback that will be invoked, Node-style, with a `error` argument first that should be null, and a `ticket` argument second, that will be either `undefined` if no ticket exists, or an Auth Ticket a qualifying one exists.

##### `AuthenticationStorage.set(claimType, context, ticket, callback)`
Store an auth ticket. Invoke an asynchronous callback to indicate that the ticket was successfully stored.
**Arguments:**
 - `claimType` *(String)* A string representing the type of ticket to store. Can be one of the following strings:
    - `"platform"` -- an app claim for your application
    - `"developer"` -- a user claim for a developer account to use Platform services
    - `"admin-user"` -- a user claim for an administrator to work with tenant data
 - `context` *(Object)* The context object your client includes. This context is required to calculate a unique key for the stored ticket.
 - `callback` *(Function)* A callback that will be invoked, Node-style, with a `error` argument that should be null. There is no result sent to this callback; as long as the error is null, the operation succeeded.

If you need auth persistence, consider using the [Multipass][1] plugin for AuthenticationStorage.

#### Request Transforms

Another plugin type is `RequestTransform`. A request transform is a function which adjusts the configuration for HTTP requests at a low level. A RequestTransform plugin must attach this function to clients as a `.requestTransform` property.

The SDK comes packaged with on such plugin: FiddlerProxy, which is useful for development. You can use a local HTTP request monitor proxy like Fiddler or Charles to monitor SDK requests; just use the `FiddlerProxy` plugin and export the environment variable `USE_FIDDLER` to turn it on.

```js
//gin up clients you can monitor with a proxy
var FiddlerProxy = require('mozu-node-sdk/plugins/fiddler-proxy');
var productClient = require('mozu-node-sdk/clients/commerce/catalog/admin/product')({
  plugins: [FiddlerProxy]
});
```

When the `USE_FIDDLER` environment is nonempty, the above client will route all requests through the proxy at `http://127.0.0.1:8888`.

The `.requestTransform` receives as its argument, and must return, an object of configuration that could be supplied to the builtin Node `http.request` method.

#### Setting Environment Variables

OSX, any Unix, or Cygwin:
```
# for the duration of one command, usually npm test
USE_FIDDLER=1 npm test
# permanent on
export USE_FIDDLER=1
# off
export USE_FIDDLER=
```

PowerShell:
```
# on
$env:USE_FIDDLER=$true;
# off
$env:USE_FIDDLER=$null;
```

cmd.exe, the Windows Command Prompt:
```
# on
set USE_FIDDLER=1
# off
set USE_FIDDLER=
```


### Extras

#### Validate Hashes

The JavaScript SDK comes with an implementation of the Mozu API message hash function. You can get the hash of a request stream with `mozu-node-sdk/src/security/hash-stream`:
```js
var url = require('url');
var hashStream = require('mozu-node-sdk/src/security/hash-stream');

// `req` is an IncomingMessage generated by an http.Server
var queryString = url.parse(req.url, true).query,
    date = queryString.dt;
var s = req.pipe(hashStream(client.context.secretKey, date));

s.end();
s.read(); // returns an SHA-256 hash of the request
```

This hash stream is used in the request validator that follows.

#### Validate Requests

Incoming messages from the Events API come with an SHA-256 hash in the query string. You can confirm possession of a shared secret by verifying this hash, using the `mozu-node-sdk/src/security/is-request-valid` function.
```js
var isRequestValid = require('mozu-node-sdk/src/security/is-request-valid');

// `req` is an IncomingMessage generated by an http.Server
isRequestValid(client.context, req, function(valid) {
    // `valid` is true if the hash checks out,
    // and false if it does not, or if the timeout
    // in context.capabilityTimeoutInSeconds (default 180)
    // has expired
});
```

## Development 

### Requirements

*   NodeJS >= 0.12

### Testing

The tests use the [Mocha](http://mochajs.org/) framework and the [Chai](http://chaijs.com/) assertion library, with the [Chai as Promised](http://chaijs.com/plugins/chai-as-promised) extensions for native Promise support in assertions.

Run the tests with:
```
npm test
```

Mocha will run all .js file in the `test` directory. To add a test, simply copy one of the existing test files to use its setup boilerplate, and then modify the `it()` function.

The tests are set up to run against a live Mozu sandbox. Configure which sandbox is used by adding a `mozu.config.json` file in the root SDK directory. Without this file, the tests will all fail.

The clients in the unit tests are all configured to use the FiddlerProxy plugin, so export the `USE_FIDDLER` environment variable as described above in order to monitor the test network traffic.

[1]: https://github.com/zetlen/mozu-multipass "Multipass Authentication Storage Plugin"