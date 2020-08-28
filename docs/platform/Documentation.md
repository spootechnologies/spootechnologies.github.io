# SPOO Platform Docs

SPOO - Single Point of Object.

## Install

A SPOO Platform runs on Node.js.

```javascript
npm install spoojs
```


# Example Setup

Setting up a platform is fairly simple. Here is a simple example for a platform with:

* Two Object Families
* Standard REST Interface


```javascript
// import the spoo and objy (spoo relys on objy for app development)
const SPOO = require('spoojs');

// define some "object families"
SPOO.OBJY.define({
  name: "user",
  pluralName: "users",
  authable: true
})

SPOO.OBJY.define({
  name: "object",
  pluralName: "objects"
})

// run the platform via REST
SPOO.REST({
  port:80,
  OBJY: OBJY,
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost")
}).run()
```

# Functionalities

## Object Families

Object families are ...


```javascript
SPOO.OBJY.define({

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
SPOO.OBJY.define({
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


## Meta Mapper

> this is a must have!

The Meta Mapper is a mapper to a MongoDB instance, that holds some basic information for the platform itself.


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

SPOO.OBJY.define({
  name: "user",
  pluralName: "users",
  authable: true
})

SPOO.REST({
  port: 80,
  OBJY: OBJY,
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
