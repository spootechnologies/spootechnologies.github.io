# SPOO 

Welcome to the SPOO Documentation Site. Here you'll find the docs for the SPOO framework as well as for the Client SDK.


## Prequesits

For setting up a SPOO platform, you need a JavaScript Runtime, like Node.js, Deno or Browsers.


## Quick Example

This quick example shows you how to spin up a platform with just a few lines of code.

#### Spin up a Platform

```javascript
// import the spoo and objy (spoo relys on objy for app development)
const SPOO = require('@spootechnologies/spoo');
const OBJY = rquire('@spootechnologies/objy');

// define an "object family"
SPOO.define({
  name: "user",
  pluralName: "users",
  authable: true
})

// run the platform via REST
SPOO.REST({
  port:80,
  ...
}).run()
```

#### Set up a Client (SDK)

Install via script tag:

```html
<script src="spoo.js">
```

or npm:

```shell
npm i spoo-client
```

Authenticate and get some users:

```javascript
const spoo = new SPOO_Client().workspace('mytenant');

spoo.io().auth("user", "pass", function(data, err){
  if(!err) console.log('you are in!');
})

spoo.io().users({}).get(function(data, err){
  if(!err) console.log('users:', data)
})
```


Setting up the SDK and working with it really is't hard. The API ist designed as fluent interface. 

All single calls are initialized with `spoo.io()`, after which methods can be chained.


#### Working with objects

```javascript

// Add an object
spoo.io().Object({
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
spoo.io().Object("objectid...").addProperty({
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

