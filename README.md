# Mozu Node SDK

The Mozu Node SDK provides a NodeJS API for connecting to Mozu web services.

## Usage

Full reference documentation is available in the form of the [REST Resources](http://developer.mozu.com/resources/) section in the Mozu Developer Center. The Node SDK has methods for each one of the resources listed here. Below is a quick getting-started guide.

### Getting an API Client

You may pass configuration into the client factory directly:

```js
var client = require('mozu-node-sdk').client({
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

In order to pass context from layer to layer of the API, traverse the graph by calling each layer as a function instead of a plain dot lookup. For example, accessing Platform.AdminUser.Accounts would be `client.platform().adminuser().accounts()`, rather than `client.platform.adminuser.accounts`.

```js
var client = require('mozu-node-sdk').client();

client.context.tenant = 1234;

function log(result) {
    console.log(util.inspect(result));
}

function reportError(error) {
    console.error(error.message, error);
}

client.commerce().catalog().admin().product().getProducts({
    filter: 'categoryId req 123'
}).then(log, reportError);
```

### Modifying Context

A full context is necessary before making calls. The Mozu API needs requests to have a full collection of context headers before it will respond to requests. You can load context initially when creating a client, but you can also modify context on an existing client by simply updating the values in the `client.context` object.

The following context values will be sent as HTTP request headers when they are present. 
 - `client.context['app-claims']`: The claims header for your associated Application. The SDK manages its own authentication, so you should rarely have to use this as long as you have it in your configuration. Required for all calls.
 - `client.context['user-claims']`: The claims header for your associated user. The SDK manages its own authentication, so you should rarely have to use this as long as you have it in your configuration. Required for many calls.
 - `client.context['tenant']`: The tenant ID, for scoping calls to a tenant. Required at minimum for all calls to services outside the Home Pod; `tenant` is the outermost scope.
 - `client.context['site']`: The site ID, for scoping calls to a site.
 - `client.context['master-catalog']`: The master catalog ID, for scoping calls to a master catalog.
 - `client.context['catalog']`: The catalog ID, for scoping calls to a catalog..
 - `client.context['dataview-mode']`: The data view mode for a call. This can be either `LIVE` (default) or `PENDING`. A data view mode of `PENDING` will show staged changes as if they are live. 

You can also store arbitrary data on the context, and it will be passed around to the various clients you create. This can be useful for login information, common state, or secret keys.

### Navigating Sections

The client object has subsections for each service, and sub-properties for each method. In order to preserve client context, navigate the object tree of sections by calling each one as a function. This passes and preserves context between the API clients.

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
client.content().documentlists().document().getDocuments({
    pageSize: 5,
    documentListName: 'files@mozu'
});
```

The `options` argument is optional, but consists of any option that can be passed to the underlying [needle](https://github.com/tomas/needle) library, or other special options described below.

```js
client.content().documentlists().document().getDocuments({
    pageSize: 5,
    documentListName: 'files@mozu'
}, {
    timeout: 60000,
    multipart: true
});
```

#### Other Options

 - `parseDates` *(Boolean)* Parse ISO 8601 dates in the Mozu API JSON responses into native JavaScript dates. This option uses regular expressions and slows down JSON parsing by a small (linear) amount. It defaults to `true`. If you're having performance problems, you can set it to `false` for one call or in your `defaultRequestOptions` for all calls.

 - `context` *(Object)* Override the current client context for the duration of one call.
   ```js
   client.content().documentlists().document().getDocuments({
       pageSize: 5,
       documentListName: 'files@mozu'
   }, {
       timeout: 60000,
       multipart: true,
       context: {
           site: 6789
       }
   });
   ```

You can set the `defaultRequestOptions` property of your client object for certain options to be passed in to every request:
```js
client.defaultRequestOptions = {
  proxy: "http://127.0.0.1:8888",
  rejectUnauthorized: false
};
```

You can set these defaults for all client objects by calling the `setDefaultRequestOptions()` method on the SDK itself.
```js
require('mozu-node-sdk').setDefaultRequestOptions({
    proxy: "http://127.0.0.1:8888",
    rejectUnauthorized: true
});
```

### Handling Responses

All API calls return a Promise, specifically a [when](https://github.com/cujojs/when) promise. Promises are one of the most standard and popular ways of handling asynchronous code in JavaScript. The Promise represents an "eventual value". It's an object which is either pending, resolved (success) or rejected (failure). You can attach handlers to it using the standard `.then(onResolved, onRejected)` method.

Crucially, promises can be chained. Inside a promise handler, you can return a promise in order to produce a promise that will only resolve once both the inner and outer promise have.

```js
// get a customer ID from an order and then get all orders for that customer
client.commerce().order().getOrder({ orderId: 'ab96c79e59b79a76' }).then(function(order) {
   return client.commerce().order().getOrders({
    filter: "CustomerId eq " + order.customerAccountId
   })
}).then(function(orders) {
    // orders will be a list of orders for the customer of the first order
});
```

Including [when](https://github.com/cujojs/when) in your project gives you access to static methods which can manipulate when-generated promises. This can be useful for higher-order promise tasks, such as joining multiple promises together into a single result.

```js
// get a fully-hydrated customer from an order and add all orders for that customer
var when = require('when');

function joinCustomerAndOrdersFromOrder(order) {
   return when.join(
    client.commerce().order().getOrders({
      filter: "CustomerId eq " + order.customerAccountId
   }),
    client.commerce().customer().customerAccount().getAccount({
      accountId: order.customerAccountId
   }));
}

client.commerce().order().getOrder({ orderId: 'ab96c79e59b79a76' })
  .then(joinCustomerAndOrdersFromOrder).spread(function(orders, customer) {
    // orders will be a list of orders for the customer,
    // customer will be the full customer object
    console.log("Customer:", customer)
    console.log("Orders:", orders)
}, function() {
    console.error("Request failed");
});
```

### Extras

#### Creating Clients Directly

You can retrieve the `Client` constructor directly:

```js
var Client = require('mozu-node-sdk/src/client');

var client = new Client({
    context: someContextObject,
    plugins: [somePlugin],
    defaultRequestOptions: someDefaultRequestOptions
});
```

#### Authentication Storage

The `require('mozu-node-sdk').client()` factory actually takes two arguments: a context, and a `plugins` array. Currently, the only supported plugin type is `AuthenticationStorage`. You can supply an AuthenticationStorage plugin by putting it in an array you send to the second argument to the client factory:

```js
// `null` to fetch context from a local config file
var persistentAuthClient = require('mozu-node-sdk').client(null, {
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

The only plugin that exists so far is [Multipass](https://github.com/zetlen/mozu-multipass) for AuthenticationStorage.

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

## Development requirements

*   NodeJS >= 0.10

## Test

The tests use the [Mocha](http://mochajs.org/) framework and the [Chai](http://chaijs.com/) assertion library, with the [Chai as Promises](http://chaijs.com/plugins/chai-as-promised) extensions for native Promises support in assertions.

Run the tests with:
```
npm test
```

Mocha will run all .js file in the `test` directory. To add a test, simply copy one of the existing test files to use its setup boilerplate, and then modify the `it()` function.

The tests are set up to run against a live Mozu sandbox. Configure which sandbox is used by modifying the `contextConfig` object in `test/utils/config.js`.


### Monitoring with Fiddler

You can use a local HTTP request monitor proxy like Fiddler or Charles; just export the environment variable `USE_FIDDLER`.


Doing that on OSX, any Unix, or Cygwin:
```
# on
export USE_FIDDLER=1;
# off
export USE_FIDDLER=;
```

Doing that in PowerShell:
```
# on
$env:USE_FIDDLER=$true;
# off
$env:USE_FIDDLER=$null;
```

Doing that in cmd.exe, the Windows Command Prompt:
```
# on
set USE_FIDDLER=1
# off
set USE_FIDDLER=
```
