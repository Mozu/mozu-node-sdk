# Mozu Node SDK

The Mozu Node SDK provides a NodeJS API for connecting to Mozu web services.

Requirements:
 - ArcJS, **or**
 - Node 4.0 and above, **or**
 - Node 0.12 and below, **with a global Promise polyfill [as shown below](#promise-global-now-required)**

## Get Started

To learn how to use the Mozu Node SDK, read our Pulitzer Prize-winning [Getting Started](https://www.mozu.com/docs/developer/sdks/mozu-node-sdk.htm) guide.

## Usage

Full reference documentation is available in the form of the [REST API](http://developer.mozu.com/content/api/APIResources/Resource_Overview.htm) section in the Mozu Developer Center. The Node SDK has methods for each one of the resources listed here. Below is a quick getting-started guide.

### Getting an API Client

You may pass configuration into the client factory directly:

```js
var client = require('mozu-node-sdk/clients/platform/application')({
    context: {
        "appKey": "00000",
        "sharedSecret": "9864c0520cc0468397faa37600f1f110",
        "baseUrl": "https://home.mozu.com/",
        "basePciUrl" : "https://pmts.mozu.com/"
        "developerAccountId": "001",
        "developerAccount": {
            "emailAddress": "example@volusion.com",
            "password": "Password123!"
        }
    }
});
```

Or, if you have a JSON file in your working directory called `mozu.config.json` or `mozu.config`, the SDK will attempt to read configuration out of that instead, and you can call the client factory with no arguments.

For creating credit cards in mozu set the basePciUrl to one of the following
- https://payments-sb.mozu.com/ for Sandbox tenants
- https://pmts.mozu.com/ for production tenants

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
 - `client.context['appKey']`: The key for the Mozu application that the client object will use for auth when it sends API requests. The default authentication provider will use this application key when it's trying to get its initial set of app claims. A new client object will do this silently, prior to its first API call, and then it manages, reuses, and refreshes those app claims as necessary for ensuing calls.
 - `client.context['sharedSecret']`: The shared secret for the Mozu application that the client object will use for auth when it sends API requests. The default authentication provider will use this shared secret when it's trying to get its initial set of app claims. A new client object will do this silently, prior to its first API call, and then it manages, reuses, and refreshes those app claims as necessary for ensuing calls.
 - `client.context['baseUrl']`: The base URL (usually just a domain name) representing the "home pod" for the Mozu API. **For all production and sandbox uses, this will be https://home.mozu.com/.** For different Mozu environments (such as internal integration and staging environments), this domain will differ. This is the "bootstrap" domain; the SDK knows how to retrieve the domains for your tenants by calling the services on this domain.
 - `client.context['basePciUrl']`: To comply with Payment Card Industry (PCI) rules, Mozu hosts its PaymentService, which stores credit card data, on separate hardware from the rest of its systems. If your code will need to talk directly to the PaymentService (which is rare unless you're doing actual transaction processing) then you will need to add this domain to your context configuration. It may differ based on your individual tenant configuration; Mozu Support will provide you with yours.
 - `client.context['tenantPod']`: The base domain for tenant-related API calls (that is, all calls that access actual tenant data). Normally, the client object will call the TenantService on the home pod to find this URL, before placing tenant calls, so all you need to specify in the context is the `tenantId`. If you know ahead of time what tenant your code will need to access, then you can hardcode the tenant pod URL in your context.
 - `client.context['developerAccount']`: An object with an `emailAddress` property and a `password` property, that the client object will use when trying to authenticate to services that require developer login, such as the AppDev file sync services. **Do not hardcode your password in a file!** If you need persistent authentication, we recommend using an AuthenticationStorage plugin such as [Multipass][1].
 - `client.context['developerAccountId']`: A unique ID for the particular Developer Account context that your developer user should use when contacting App Dev. Unless you are talking to the App Dev services it should not be necessary; you can look it up by examining the numbers next to your developer account link in the Mozu Launchpad immediately after login.
 - `client.context['adminUser']`: An object with an `emailAddress` property and a `password` property, that the client object will use when trying to authenticate to services that require an admin user, such as SiteSettings. **Do not hardcode your password in a file!** If you need persistent authentication, we recommend using an AuthenticationStorage plugin such as [Multipass][1].

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
var cartClient = require('mozu-node-sdk/clients/commerce/cart')()
```

Share context between clients by passing client instances to each others' constructors.
```js
var productSearchClient = require('mozu-node-sdk/clients/commerce/catalog/storefront/productSearchResult')(cartClient);
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

All API calls return a Promise, specifically either a native Promise where available, or a shimmed Promise. Promises are one of the most standard and popular ways of handling asynchronous code in JavaScript. The Promise represents an "eventual value". It's an object which is either pending, resolved (success) or rejected (failure). You can attach handlers to it using the standard `.then(onResolved, onRejected)` method.

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

### Promise Global Now Required
**As of version 2.0, the Mozu Node SDK expects a global `Promise` constructor to exist. In Node 4.0 and above, native Promises are available, but if you are using the Mozu Node SDK on Node 0.12 or below, *you will need to use a Promise shim.* Mozu recommends the [When ES6 shim](https://github.com/cujojs/when/blob/master/docs/es6-promise-shim.md).**

On Node 0.12 or below:
```javascript
if (typeof Promise !== "function") require('when/es6-shim/Promise.browserify-es6');
var client = require('mozu-node-sdk/clients/path/to/client');
```

This guarantees that the global `Promise` constructor will be available. That constructor has static methods which can manipulate promises. This can be useful for higher-order promise tasks, such as joining multiple promises together into a single result.

### Plugins

The Mozu Node SDK has a simple plugin system. A Client object created by any one of the client generation methods has a set of semi-private methods that it uses for internal behavior. By default, a generated client has implementations of these methods that are appropriate for a standard NodeJS or ArcJS context, but you can swap these out on any client object. Each method has a different name and signature; this is pretty deliberately under-engineered.

One convenience: you can supply an array of `plugins` to the client factory method configuration object, alongside the `context`. Each plugin is a function that will receive the client and can should append or replace one of the properties below.

#### Plugin Types

##### Authentication Storage: `client.authenticationStorage`

An Authentication Storage plugin must supply a `client.authenticationStorage` object. It must have `get` and `set` methods. The SDK will call this object internally to store and retrieve auth tickets.

 - `AuthenticationStorage.get(claimType, context, callback)`

    Retrieve a stored auth ticket. Should never return tickets whose refresh tokens have expired.

    **Arguments:**
     - `claimType` *(String)* A string representing the type of ticket to retrieve. Can be one of the following strings:
        - `"platform"` -- an app claim for your application
        - `"developer"` -- a user claim for a developer account to use Platform services
        - `"admin-user"` -- a user claim for an administrator to work with tenant data
     - `context` *(Object)* The context object your client includes. This context is required to calculate a unique key for the stored ticket.
     - `callback` *(Function)* A callback that will be invoked, Node-style, with a `error` argument first that should be null, and a `ticket` argument second, that will be either `undefined` if no ticket exists, or an Auth Ticket a qualifying one exists.

 - `AuthenticationStorage.set(claimType, context, ticket, callback)`

    Store an auth ticket. Invoke an asynchronous callback to indicate that the ticket was successfully stored.

    **Arguments:**
    - `claimType` *(String)* A string representing the type of ticket to store. Can be one of the following strings:
      - `"platform"` -- an app claim for your application
      - `"developer"` -- a user claim for a developer account to use Platform services
      - `"admin-user"` -- a user claim for an administrator to work with tenant data
    - `context` *(Object)* The context object your client includes. This context is required to calculate a unique key for the stored ticket.
    - `callback` *(Function)* A callback that will be invoked, Node-style, with a `error` argument that should be null. There is no result sent to this callback; as long as the error is null, the operation succeeded.

If you need auth persistence, consider using the [Multipass][1] plugin for AuthenticationStorage.

##### Request Transform: `client.requestTransform`

Another plugin type is Request Transform. A request transform is a function which adjusts the configuration for HTTP requests at a low level. A RequestTransform plugin must attach this function to clients as a `.requestTransform` property.

The SDK comes packaged with on such plugin: FiddlerProxy, which is useful for development. You can use a local HTTP request monitor proxy like Fiddler or Charles to monitor SDK requests; just use the `FiddlerProxy` plugin and export the environment variable `USE_FIDDLER` to turn it on.

```js
//gin up clients you can monitor with a proxy
var FiddlerProxy = require('mozu-node-sdk/plugins/fiddler-proxy');
var productClient = require('mozu-node-sdk/clients/commerce/catalog/admin/product')({
  plugins: [FiddlerProxy()]
});
```

When the `USE_FIDDLER` environment is nonempty, the above client will route all requests through the proxy at `http://127.0.0.1:8888`. If the Fiddler is running on another machine or VM, the proxy url can be set up by passing a configuration object to the plugin:

```js
  FiddlerProxy({ url: 'http://192.168.1.37:8888' })
```

The `.requestTransform` receives as its argument, and must return, an object of configuration that could be supplied to the builtin Node `http.request` method.

##### Prerequisite Tasks: `client.prerequisiteTasks`

A plugin type which has immense control over SDK client behavior is the Prerequisite Tasks plugin. By default, a client will inspect every request to make sure it has necessary prerequisites before actually dispatching the request. These prerequisites might include authentication, context completion checking, or the determining of the appropriate base URL. The default array of prerequisite tasks is designed for a NodeJs environment and an app that will require authentication.

A Prerequisite Tasks plugin is a function which assigns an *array of Promise-returning functions to the `client.prerequisiteTasks` property of a client.* The functions are run in order and their composed output is sent to the client.

Each function receives a `state` object with `client`, `requestConfig`, and `url` properties, and must return the same type of object, or a Promise for the same type of object. The function can also throw an exception to cancel the client request.

##### URL Resolver: `client.urlResolver`

This plugin type can govern how URL templates from the generated client methods turn into fully realized URLs. It's a function that receives three arguments: a Client instance, a URI template (according to the RFC), and a request body as JSON. It must return a string URL.

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

Incoming messages from the Events API come with an SHA-256 hash in the headers of the request. You can confirm possession of a shared secret by verifying this hash, using the `mozu-node-sdk/src/security/is-request-valid` function.
```js
var isRequestValid = require('mozu-node-sdk/src/security/is-request-valid');

// `req` is an IncomingMessage generated by an http.Server
isRequestValid(client.context, req, function(err) {
    // `err` only contains a value if the isRequestValid method generates an error,
    // or if the timeout in context.capabilityTimeoutInSeconds (default 180) has expired.
    // Pass a callback function here to handle the result.
    // Here is a pattern for use with something like Express middleware:
    if(err) {
        res.status(401);
        res.render('error', {message: err.message, error: err});
    } else {
        console.log("Validated request.");
        next();
    }
});
```

## Development

### Requirements

*   NodeJS >= 4.2

### Testing

The tests use the [tape](https://github.com/substack/tape) framework. Tests should be simple and should use [jort](http://npmjs.com/package/jort) to mock service responses.

Run the tests with:
```
npm test
```

The tests are set up to run against a live Mozu sandbox. Configure which sandbox is used by adding a `mozu.test.config.json` file in the root SDK directory. Then, set the environment variable `MOZU_TEST_LIVE` to true.

The clients in the unit tests are all configured to use the FiddlerProxy plugin, so export the `USE_FIDDLER` environment variable as described above in order to monitor the test network traffic.

[1]: https://github.com/zetlen/mozu-multipass "Multipass Authentication Storage Plugin"
