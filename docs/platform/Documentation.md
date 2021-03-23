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


# API Basics

Once your platform is up and running, you should try some basics, like creating a workspace and registering a user.

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

## Object Families

Object families are wrappers for different kinds of objects. 

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

### Custom Mappers

Every Object Wrapper can have custom plugged-in technologies for `persistence`, `processing` and `observing`


```javascript
SPOO.define({
  storage: new mongo("..."),
  processor: new vm(""),
  observer: new interval() 
})
````


## Workspaces

For ***multitenancy***, any SPOO Platform can have multiple workspaces. Each workspace is an isolated space for each tenant.

The workspace registration feature is enabled by default, but can be changed with:

```javascript
SPOO.allowClientRegistrations = true | false
```

### Create a workspace

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

### Register a user

This feature is enabled by default and can be changed with:

```javascript
SPOO.allowUserRegistrations = true | false
```
TO BE DOCUMENTED... (coming soon)


## Meta Mapper

The Meta Mapper is a mapper to a MongoDB instance, that holds some basic information for the platform itself. It is used for things like storing workspace information or temporary registrations keys.


```javascript
SPOO.REST({
  ...
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost"),
  ...
}).run()
````


# Deploy

Any SPOO Platform can be deployed in different architectures and scales.


* 1. Create a platform file (e.g. platform.js)
* 2. Define your platform
* 3. Run the file


#### Example Platform File (platform.js)

```javascript
const SPOO = require('spoo');

SPOO.define({
  name: "user",
  pluralName: "users",
  authable: true
})

SPOO.REST({
  port: 80
}).run()
```


## Command Line

```shell
node platform.js
```


## Docker

> Dockerfile:

```Dockerfile
FROM node:alpine

add platform.js ./
RUN npm i
CMD node platform.js
EXPOSE 80
```

> In your shell:

```shell
docker build -t spoo-platform .
docker run ...
```

## Kubernetes

SPOO can also be deployed on Kubernetes with a SPOO deployment and a corresponding service. 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spoo-platform
  labels:
    app: platform
spec:
  selector:
    matchLabels:
      app: platform
  template:
    metadata:
      labels:
        app: platform
    spec:
      containers:
      - name: spoo-platform
        image: REPO...
        ports:
          - name: http
            containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: spoo-platform-service
spec:
  selector:
    app: platform
  ports:
   - protocol: TCP
     port: 80
     targetPort: http
```
