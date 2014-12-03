# Mozu Node SDK

The Mozu Node SDK provides a NodeJS API for connecting to Mozu web services.

## Usage

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

client.commerce().catalog().admin().products().getProducts().then(function(res) {
  console.log(util.inspect(res));
}, function(err) {
  console.log(util.inspect(err));
})
```

## Development requirements

*   NodeJS >= 0.10

## Test

    npm test

The tests use Nock to record HTTP requests on the first run, and then use the recorded requests as fixtures for subsequent runs. You can export an environment variable called `NOCK_RECORD` to force re-recording of requests; otherwise they expire every 24 hours.

You can also use a local HTTP request monitor proxy like Fiddler or Charles; just export the environment variable `USE_FIDDLER`.
