# <b>Quickstart</b>

Welcome to the SPOO Documentation. Here you'll find the docs for the SPOO framework as well as for the JS Client SDK and REST API.
The following quick examples show you how to spin up a platform and a client with just a few lines of code.

![Platform](https://spoo.io/assets/img/platform.png)

> For running a basic platform you will need ***Node.js***, ***Redis*** and ***MongoDB***

## Spin up a basic (minimal) platform

```shell
npm i spoojs objy
```

```javascript
// 1. import spoo
const SPOO = require('spoojs');
const OBJY = require('objy');

// 2. define some "object wrappers"
OBJY.define({
  name: "user",
  pluralName: "users",
  authable: true
})

OBJY.define({
  name: "object",
  pluralName: "objects"
})

// 3. run the platform via REST
SPOO.REST({
  port:80,
  OBJY,
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost") // The matamapper is for basic config
}).run()
```

## Spin up a real-life (advanced) platform

```shell
npm i spoojs objy objy-catalog
```

```javascript
// 1. import spoo
const SPOO = require('spoojs');
const OBJY = require('objy');
const OBJY_CATALOG = require('objy-catalog');

// Define a mongo connection (for use with multiple object families)
var mongoCon = new OBJY_CATALOG.mappers.storage.mongo(OBJY).connect('mongodb://localhost', function(data) {
    console.info('mongo connected')
}, function(err) {
    console.info('mongo not connected:', err)
});

// 2. define some "object wrappers"
OBJY.define({
  name: "user",
  pluralName: "users",
  authable: true,
  // Attach a mongo mapper with the previously initialized mongo connection
  storage: new OBJY_CATALOG.mappers.storage.mongo(OBJY).useConnection(mongoCon.getConnection(), function() {})
})

OBJY.define({
  name: "object",
  pluralName: "objects",
  storage: new OBJY_CATALOG.mappers.storage.mongo(OBJY).useConnection(mongoCon.getConnection(), function() {})
})

// 3. run the platform via REST
SPOO.REST({
  port:80,
  OBJY,
  // Use a "message mapper" which handles internal email communication (e.g. reset passwort, etc).
  messageMapper: new SPOO.messageMappers.sendgridMapper().connect("API_KEY"),
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost"),
  // Specify redis connection for handling user sessions. Defaults to localhost
  redisCon: {
      host: "redis host",
      port: 6380,
      password: "bla"
  }
}).run()
```

## Set up a Client (JavaScript SDK)

> Install via npm or script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@spootechnologies/spooclient@0.0.13/index.js">
```
or
```shell
npm i @spootechnologies/spooclient
```

```javascript
// 1. Initialize the client
const spoo = new SPOO_Client('mytenant');

// 2. Authenticate a user
spoo.io().auth("user", "pass", function(data, err){
  if(!err) console.log('you are in!');
})

// Add an object
spoo.io().object({
  name: "Mercedes",
  type: "car",
  properties: {
    owner : {
      type: "shortText",
      value: "Peter Griffin"
    }
  }
}).add(function(data, err)
{
  if(err) return console.error(err);
  console.log(data); // {...object...}
})

// Modify an object
spoo.io().object("objectid...").addProperty({
  color: {
    type: "shortText",
    value: "red"
  }
}).save(function(data, err)
{
  if(err) return console.error(err);
  console.log(data); // {...updated object...}
})
```


# <b>Fundamentals</b>

## Dynamic objects

> SPOO uses OBJY for it's abstract, object-driven programming model. Specific endpoints are mapped to predefined object methods, like add, update, query, get and remove. Logic can be implemented using these objects. Learn more about OBJY here...


```javascript
SPOO.define({

  // needed params:
  name: "template", // the singular name for single object access
  pluralName: "templates", // the plural name for access to multiple objects

  // optional params:
  authable: false, // Sets wether objects of an object family can authenticate (login) against the platform
  templateFamily: "templates", // Defines, where inherited objects are retrieved from. Defaults to object family itself.

  // overwrite mappers (default mappers are all in memory):
  storage: new mongo("..."),
  processor: new vm(""),
  observer: new interval() 
})

````

## Custom Mappers

Every Object Wrapper can have custom plugged-in technologies for `persistence`, `processing` and `observing`


```javascript
SPOO.define({
  storage: new mongo("..."),
  processor: new vm(""),
  observer: new interval() 
})
````

## REST Interface

The REST Interface is the default interface in SPOO. It spins up an express server, that has all the required SPOO routes ready.

```javascript
SPOO.REST({
  port: 80, // The port to run on
  redisCon: "localhost", // The redis connection (for session storage)
})
````

This will splin up the API at `/api`:

```curl
HOST/api
```


## Workspaces

For ***multitenancy***, any SPOO Platform can have multiple workspaces. Each workspace is an isolated space for each tenant.

The workspace registration feature is enabled by default, but can be changed with:

```javascript
SPOO.allowClientRegistrations = true | false
```

Creating a workspace is done in two steps:

1. Get a registration key via email
```curl
POST HOST/api/client/register {email: "YOUR EMAIL"}
```

2. Register a workspace with tat key
```curl
POST HOST/api/client {registrationKey: "KEY", clientname: "YOUR WORKSPACE NAME"}
```


## User accounts

User accounts are defined using an object wrapper with the `authable` flag set to `true`

```javascript
SPOO.define({
   name: "user",
   pluralName: "users",
   authable: true
})
```

## Metadata

The Meta Mapper is a mapper to a MongoDB instance, that holds some basic information for the platform itself. It is used for things like storing workspace information or temporary registrations keys.


```javascript
SPOO.REST({
  ...
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost"),
  ...
}).run()
````

## Messaging system

...

