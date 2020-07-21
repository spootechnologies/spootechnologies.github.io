# SPOO Platform Docs

SPOO - Single Point of Object.

## Install


```javascript
npm install @spootechnologies/spoo
```

## Run

A SPOO Platform runs on JavaScript Runtimes, like Node.js or Deno.
For Production Deployments, we have a few resources for running a platform on different systems.


Learn more under [Deploy](#deploy)


# Example Setup

Setting up a platform is fairly simple. Here is a simple example for a platform with:

* Two Object Families
* Standard REST Interface


```javascript
// import the spoo and objy (spoo relys on objy for app development)
const SPOO = require('@spootechnologies/spoo');
const OBJY = require('@spootechnologies/objy');

// define an "object family"
SPOO.define({
  name: "user",
  pluralName: "users",
  authable: true
})

// run the platform via REST
SPOO.REST({
  port:80,
  metaMapper: new SPOO.metaMappers.mongoMapper().connect("mongodb://localhost"),
  messageMapper: new SPOO.messageMappers.sendgridMapper().connect("2424")
  ...
}).run()
```

# Functionalities

## Object Families

Object families are ...


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

Every Object Family can have ...


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


## Meta Mapper

...


```javascript
SPOO.REST({
  port: 80, // The port to run on
  redisCon: "localhost", // The redis connection (for session storage)
})

````


# Deploy

Any SPOO Platform can be deployed in different architectures and scales.


* 1. Create a platform file (e.g. platform.js)
* 2. include the dependencies (spoo, objy and the mapper catalog if needed)
* 3. Run the file


#### Example Platform File (platform.js)

```javascript
const SPOO = require('@spootechnologies/spoo');
const OBJY = require('@spootechnologies/objy');

SPOO.define({
  name: "user",
  pluralName: "users",
  authable: true
})

SPOO.REST().run()
```



## Command Line

```shell
node platform.js
# or
deno run platform.js
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