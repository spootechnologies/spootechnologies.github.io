# Quickstart 

Welcome to the SPOO Documentation Site. Here you'll find the docs for the SPOO framework as well as for the Client SDK.
The following quick examples show you how to spin up a platform and a client with just a few lines of code.

# Spin up a Platform


> Install via npm:

```shell
npm i spoojs
```

```javascript
// import the spoo and objy (spoo relys on objy for app development)
const SPOO = require('spoojs');

// define some "object wrappers"
SPOO.define({
  name: "user",
  pluralName: "users",
  authable: true
})

SPOO.define({
  name: "object",
  pluralName: "objects"
})

// run the platform via REST
SPOO.REST({
  port:80,
  ...
}).run()
```

# Set up a Client (SDK)

> Install via npm or script tag:

```html
<script src="spoo.js">
```

```shell
npm i spoo-client
```

```javascript
// 1. Initialize the client
const spoo = new SPOO_Client().workspace('mytenant');

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


## Authors

* **Marco Boelling** - *Initial work* - [Twitter](https://twitter.com/marcoboelling)


## License

SPOO is open source and licensed under the AGPL license.

## Further reading

* For more information on SPOO, go to [spoo.io](https://spoo.io)

