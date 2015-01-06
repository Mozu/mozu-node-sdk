# Mozu Node SDK

The Mozu Node SDK provides a NodeJS API for connecting to Mozu web services.

## Usage

Full reference documentation is available in the form of the [REST Resources](http://developer.mozu.com/resources/) section in the Mozu Developer Center. The Node SDK has methods for each one of the resources listed here. Below is a quick getting-started guide.

### Getting an API Client

You may pass configuration into the client factory directly:

```js
var client = require('mozu-javascript-sdk').client({
    context: {
        "appId": "00000",
        "sharedSecret": "9864c0520cc0468397faa37600f1f110",
        "baseUrl": "https://home.mozu.com/",
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
var client = require('mozu-javascript-sdk').client();

client.setTenant(1234);

function log(result) {
    console.log(util.inspect(result));
}

function reportError(error) {
    console.error(error.message, error);
}

client.commerce().catalog().admin().products().getProducts({
    filter: 'categoryId req 123'
}).then(log, reportError);
```

### Modifying Context

A full context is necessary before making calls. The Mozu API needs requests to have a full collection of context headers before it will respond to requests. You can load context initially when creating a client, but you can also modify context on an existing client using these methods:

 - `client.setAppClaims`: Set the app-claims header. The SDK manages its own authentication, so you should rarely have to call this.
 - `client.setUserClaims`: Set the user-claims header. The SDK manages its own authentication, so you should rarely have to call this.
 - `client.setTenant`: Set the tenant ID.
 - `client.setSite`: Set the site ID.
 - `client.setMasterCatalog`: Set the master catalog ID.
 - `client.setCatalog`: Set the catalog ID.
 - `client.setDataviewMode`: Set the data view mode. This can be either `LIVE` (default) or `PENDING`. A data view mode of `PENDING` will show staged changes as if they are live. 

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

```
client.content().documentlists().document().getDocuments({
    pageSize: 5,
    documentListName: 'files@mozu'
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