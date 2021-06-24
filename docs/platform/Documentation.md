# SPOO Platform Docs

SPOO - Single Point of Object.

## Install

A SPOO Platform runs on Node.js.

```javascript
npm i spoojs
```

> For running a platform your will also need Redis and MongoDB

# Example Setup

Setting up a platform is fairly simple. Here is a simple example for a platform with:

* Two Object Families
* Standard REST Interface


```javascript
// import spoo
const SPOO = require('spoojs');

// define some "object families"
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
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost")
}).run()
```

# API

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

## Options

...

## Endpoints

..


# Workspaces

For ***multitenancy***, any SPOO Platform can have multiple workspaces. Each workspace is an isolated space for each tenant.

The workspace registration feature is enabled by default, but can be changed with:

```javascript
SPOO.allowClientRegistrations = true | false
```

## Create a workspace

Creating a workspace is done in two steps:

1. Get a registration key via email
```curl
POST HOST/api/client/register {email: "YOUR EMAIL"}
```

2. Register a workspace with tat key
```curl
POST HOST/api/client {registrationKey: "KEY", clientname: "YOUR WORKSPACE NAME"}
```


# User accounts

User accounts are defined using an object wrapper with the `authable` flag set to `true`

```javascript
SPOO.define({
   name: "user",
   pluralName: "users",
   authable: true
})
```

## Register a user

This feature is enabled by default and can be changed with:

```javascript
SPOO.allowUserRegistrations = true | false
```
TO BE DOCUMENTED... (coming soon)


# Metadata

The Meta Mapper is a mapper to a MongoDB instance, that holds some basic information for the platform itself. It is used for things like storing workspace information or temporary registrations keys.


```javascript
SPOO.REST({
  ...
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost"),
  ...
}).run()
````

# Messaging system

...
