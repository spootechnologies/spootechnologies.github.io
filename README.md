# <b>Quickstart</b>

Welcome to the SPOO Documentation. Here you'll find the docs for the SPOO framework as well as for the JS Client SDK and REST API.
The following quick examples show you how to spin up a platform and a client with just a few lines of code.


> For running a basic platform you will need ***Node.js***, ***Redis*** and ***MongoDB***

# SERVER

## Install

```shell
npm i spoojs objy
```


## Basic Server

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

This will splin up the API at `domain.com/api`:


# FUNDAMENTALS


## Dynamic objects

> SPOO uses OBJY for it's abstract, object-driven programming model. Specific endpoints are mapped to predefined object methods, like add, update, query, get and remove. Logic can be implemented using these objects.


```javascript
const SPOO = require('spoojs');
const OBJY = require('objy');

OBJY.define({
  name: "template", // the singular name for single object access
  pluralName: "templates", // the plural name for access to multiple objects

  // optional params:
  authable: false, // Sets wether objects of an object family can authenticate (login) against the platform
  templateFamily: "templates", // Defines, where inherited objects are retrieved from. Defaults to object family itself.
});

SPOO.REST({ OBJY, ...}).run()
````

## Custom Mappers

Every Object Wrapper can have custom plugged-in technologies for `persistence`, `processing` and `observing`

```javascript
const SPOO = require('spoojs');
const OBJY = require('objy');

OBJY.define({
  ...
  storage: new mongo("..."),
  processor: new vm(""),
  observer: new interval() 
});

SPOO.REST({ OBJY, ...}).run()
````


## Workspaces

For ***multitenancy***, any SPOO platform can have multiple workspaces. Each workspace is an isolated space for each tenant.

The workspace registration feature is enabled by default, but can be changed with:

```javascript
SPOO.allowClientRegistrations = true | false
```

Creating a workspace is done in two steps:

1. Get a registration key via email
```curl
POST HOST/api/client/register {email: "YOUR EMAIL"}
```

2. Register a workspace with that key
```curl
POST HOST/api/client {registrationKey: "KEY", clientname: "YOUR WORKSPACE NAME"}
```

## Applications

All data (objects) of a tenant are scoped with applications. See more in the clients section.

## User accounts

User accounts are defined using an object wrapper with the `authable` flag set to `true`. Users are plain objects with the difference, that user objects can authenticate against the platform. They contain login informations, such as username, email and password. 

```javascript
OBJY.define({
   name: "user",
   pluralName: "users",
   authable: true
})
```

# CLIENTS

For interacting with SPOO, there is a **REST API** and a **JavaScript SDK**.

All API Methods can be accessed in the scope of a workspace and the application, that you are working with.


Parameter | Description 
--------- | ------- 
WORKSPACE | The Workspace Name (Tenant Identifier)
APP | The App name, in which context operations will be made


## REST API


```shell
curl -X GET "URL.com/api/client/<WORKSPACE>/app/<APP>"
```


## JavaScript SDK

```html
<script src="https://cdn.jsdelivr.net/npm/@spootechnologies/spooclient@0.0.13/index.js">
```
or
```shell
npm i @spootechnologies/spooclient
```


```javascript
// Initialize
spoo = new SPOO_Client("WORKSPACE").App("APP");

// Usage
spoo.io().//some api function
```


## Authentication

All API Methods are only accessible by authenticated users. Authentication is handled with JWT (JSON Web Tokens). 
There are two kinds of tokens:

Token | Purpose 
--------- | ------- 
accessToken | This is issued in return to a user's credentials and can then be used to access a ressource. An access token is valid for 20 minutes.
refreshToken | Once an access token has expired, you can use the refresh token to request a new access token

### Login (Get Tokens)

> Authenticate a user

```shell
curl -X POST "URL.com/api/client/<YOUR CLIENT>/auth"
  -D {
    "username" : "peter",
    "password" : "mysupersecretpass",
    "permanent": true // stay signed in
  }

```
```javascript
spoo.io().auth(
  "peter", // username
  "mysupersecretpass", // password
   function(data, err) {  // callback
  
  },true // "stay signed in"
)
```


In order to request your tokens, a user has to authenticate using the username and password.
As a result, three pieces of information will be returned:

- Basic info about the user and it's privileges
- The access token
- The refresh token


```json
{
  "user": {
    "client" : "myCompany", // client identifier
    "username" : "peter.griffin", //username
    "privileges": {   // privileges (user roles)
      "demoapp" : [   // divided into applications
        {
          "name" : "admin"
        }
      ]
    },
    "spooAdmin" : false // superuser flag (only available when user is spooAdmin)
  },
  "tokens":
  {
    "accessToken" : "95u83 iomfg adsf290....",
    "refreshToken" : "93jfna8fh29n9f...."
  }
}

```

  

**Using the access token:**

  

***JavaScript SDK***

<aside class="info">
If you are using the JavaScript SDK, access token and refresh token will automatically be persisted locally. So that every call being made (after authentication) will have the access token attached to it.
If you set the fourth parameter (stay signed in) to true, refreshing access tokens using your refresh tokens will be done automatically for you.
</aside>

***REST API***

<aside class="info">
For authenticated calls against the REST API, the access token can either be passed within the authorization header:  


`"Authorization" : "Bearer 325nfdf89fn3-.235h8nd..."`

or as query parameter:  

`?accessToken=325nfdf89fn3-.235h8nd...
</aside>


### Relogin (refresh an access token)

> Request a new access token

```shell
curl -X POST "URL.com/api/client/<YOUR CLIENT>/token"
  -D {
    "refreshToken" : "325nfdf89fn3-.235h8nd..."
  }

```
```javascript
spoo.io().token(
  "325nfdf89fn3-.235h8nd...", // refresh token
    function(data, err) { // callback
})
```

> Refreshing a token returns the same information as in authentication


Refresh tokens are issued along with access tokens when a user authenticates.

They can be used to request a new access token, once an old token has expired (after 20 mins).

<aside class="info">
Refresh tokens can only be used once! Whenever you use it to get a new access token, you'll also get a new refresh token.
</aside>

### Logout (reject an access token)

> Reject an access token

```shell
curl -X POST "URL.com/api/client/<YOUR CLIENT>/token/reject"
  -D {
    "accessToken" : "325nfdf89fn3-.235h8nd..."
  }

```
```javascript
spoo.io().logout(
    function(data, err) { // callback
})
```

> Respone message

```json
{
    "message": "token rejected"
}
```

After rejecting an access token, this token can no longer be used. Also, the corresponsing refresh token will be revoked.

## Applications


You can have multiple applications within your client. An application is basically represented by an ***Application ID*** inside an object and in the URL / JS Client.


**Add Applications**


```shell
curl -X POST "URL.com/api/client/WORKSPACE/application"
  -D {
    "name" : "myapp", // This is the application identifier!
    "displayName": "My Fancy App" // This can be used to display a pretty name
  }

```
```javascript
new Client("WORKSPACE").Application({
  "name" : "myapp",
  "displayName" : "My Fancy App"
}).add(function(data, err)
{
})
```


**Get Applications**


```shell
curl -X GET "URL.com/api/client/WORKSPACE/applications"
```


```javascript
new Client("WORKSPACE").Applications().get(function(data, err)
{
})
```

> Returns

```json
[
  {
    "name" : "myapp",
    "displayName" : "My Fancy App"
  },
  {
    "name" : "anotherapp",
    "displayName" : null
  }
]
```

To get a list of all connected applications in your client, use thow follwoing syntax:


## Objects


Objects are the foundation of your applications. They represent entities, hold information, methods, listeners and events.


> Plain object schema

```javascript
{
     "_id": "5a818c47d34ee54a747bfa8e", // Unique id, auto generated
     "role": "object", // Auto generated
     "applications": ["2134124mkskfd32"], // A list of applications, where this object ist accessible from
     "inherits": ["214om214"], // A list of templates to inherit from
     "name": "rrr", // Name of the object
     "type": 'car', // Type of the object
     "onCreate": null, // Script to be executed on object creation
     "onDelete": null, // Script to be executed on object deletion
     "permissions": { // Object-wide permittions
        "admin": {
          "value": "*"
        }
     },

     // USER ONLY:
     "username": null,
     "password": "neverShown",
     "privileges": {
        "appId": "admin"
     }
}
```


**Accessing patterns**

Any one of these object types can be accessed individually or in groups

```shell
spoo.io/.../object
spoo.io/.../objects
```

```javascript
spoo.io().Object(...)
spoo.io().Objects(...)

spoo.io().User(...)
spoo.io().Users(...)
```


### Add an object

```shell
# Works for any object wrapper, like /object, /template, /anything
curl -X POST "URL.com/api/client/<YOUR CLIENT>/app/<YOUR APP>/object"
  -D {
    "name" : "my first object"
  }
```
```javascript
// Works for any constructor, like: Object(), Template(), Anything()
spoo.io().Object({name:"my first object"}).add(function(data, err) {
})
```

> Returns

```json
{
     "role": "object",
     "type": null,
     "applications": [],
     "inherits": [],
     "_id": "5a818c47d34ee54a747bfa8e",
     "name": "my first object",
     "permissions": {}
}
```


The data you pass here, will be used to initialize the object structure. Attributes that are not provided be you, will be initialized empty (null, {} or []).


### Add multiple objects

> Example

```shell
# Works for any object wrapper, like /object, /template, /anything
curl -X POST "URL.com/api/client/<YOUR CLIENT>/app/<YOUR APP>/objects"
  -D [
    {
      "name" : "my first object"
    },
    {
      "name" : "my second object"
    }
  ]

```
```javascript
// Works for any constructor, like: Object(), Template(), Anything()
spoo.io().Objects([
    {
      "name" : "my first object"
    },
    {
      "name" : "my second object"
    }
  ]).add(function(data, err) {
})
```

> Response

```json
[
  {
       "role": "object",
       "type": null,
       "applications": [],
       "inherits": [],
       "_id": "5a818c47d34ee54a747bfa8e",
       "name": "my first object",
       "onCreate": null,
       "onDelete": null,
       "permissions": {}
  },
  {
       "role": "object",
       "type": null,
       "applications": [],
       "inherits": [],
       "_id": "5a818c47d3ere54a747bfa8e",
       "name": "my second object",
       "onCreate": null,
       "onDelete": null,
       "permissions": {}
  }
]
```


### Delete an object

> Example

```shell
# Works for /object, /template, /eventlog, /file, /user
curl -X DELETE "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"

```
```javascript
// Works for: Object(), Template(), EventLog(), File(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e").delete(function(data, err) {
})
```

> Response

```json
{
     "role": "object",
     "type": null,
     "applications": [],
     "inherits": [],
     "_id": "5a818c47d34ee54a747bfa8e",
     "name": "my first object",
     "permissions": {}
}
```


### Update an Object

The following methods are used to alter an object at runtime. Every Operation returns the whole updated object.


> Example

```shell
# Works for /object, /template, /file, /user
curl -X PUT "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"
- D [
  { "setName" : ["my name"] },
  { "setType" : ["my type"] },
  { "addApplication" : ["demoapp"] },
  { "removeApplication" : ["otherapp"] },
  { "addInherit" : ["4iu9332423.423423"] },
  { "removeInherit" : ["3535343463463463.423423"] },
  { "setPermission" : ["admin", {"value" : "*"}] },
  { "removePermission" : ["plain_user"] },
  { "setOnCreate" : ["sendEmail", {"value: "email('from', 'to', 'hi', 'there')"}] },
  { "setOnDelete" : ["..."] }
]

```
```javascript
// Works for: Object(), Template(), File(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e")
  .setName("my name")
  .setType("my type")
  .addApplication("demoapp")
  .removeApplication("otherapp")
  .addInherit("4iu9332423.423423")
  .removeInherit("3535343463463463.423423")
  .setPermission("admin", { value: "*"})
  .removePermission("plain_user")
  .setOnCreate("sendEmail", {value: "email('from', 'to', 'hi', 'there')"})
  .save(function(data, err) {
})
```

> Response

```json
{
    "role": "object",
    "type": "my type",
    "applications": [
        "demoapp"
    ],
    "inherits": ["4iu9332423.423423"],
    "_id": "5a8e80d0e1e1282f7d3121e9",
    "name": "my name",
    "onCreate": {
      "sendEmail": {
        "value": "email('from', 'to', 'hi', 'there')"
      }
    },
    "permissions": 
    {
       "admin": {
          "value" : "*"
          }
    }
    
}
```

To alter an object's metadata, use the following methods:


Method | Description 
--------- | --------
***All object types, except EventLogs*** | 
`setName(name)` | Set the name of the object
`setType(name)` | Set the type of the object
`addApplication(applicationName)` | Bind the object to an application
`removeApplication(applicationName)` | Remove an application from the object
`addInherit(templateId)` | Add a template to extend in this object
`removeInherit(templateId)` | Remove an extended template
`setPermission(privilegeName, { value: permissionCodes })` | Set permissions
`removePermission(privilegeName)` | Remove a permission by privilege name
`setOnCreate(name, DSLSnippet)` | Set the onCreate Listener's DSL Code Snippet
`setOnChange(name, DSLSnippet)` | Set the onChange Listener's DSL Code Snippet
`setOnDelete(name, DSLSnippet)` | Set the onDelete Listener's DSL Code Snippet
***User only methods*** | 
`setUsername(username)` | Set the username of the user
`setEmail(email)` | Set the email of the user
`addPrivilege(privilegeName)` | Add a privilege
`removePrivilege(privilegeName)` | Remove a privilege



### Properties

Properties are what make an object alive. 

> Basic property scheme

```javascript
{
 "_id": "dsfdsf3",
 ...
  "height": { // property name
    "type" : "shortText", // property type
    "value" : "5m" // the actual value
  }
}
```


Additionally it can also have **permissions**, **onCreate**, **onChange**, **onDelete** and **query** (for reference types only)


**Property Types**

Attribute | Description 
--------- | ------- 
shortText | Text up to 255 characters  
longText | Longer texts with more than 255 characters
number | numeric value
boolean | boolean value (true, false)
date | An ISO 8601 date
objectRef | A reference to another object
bag | A bag of nested properties. Here you can nest properties of any other type (even bags for deeper nesting). Bags don't have the "value" field, but "properties" instead
action | An action that can be called. This holds a SPOO DSL Snippet
event | An event that will be observed by SPOO. Learn more below


### Add/remove/set Property


> Example

```shell
# Works for /object, /template, /user
curl -X PUT "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"
- D [
  { "addProperty" : ["my prop", { "type": "shortText", "value": "hi there"}} ],
  { "removeProperty" : ["someOtherProp"] },
  { "setPropertyValue" : ["my prop", "hello world"] }
]

```
```javascript
// Works for: Object(), Template(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e")
  .addProperty("my prop", { type: "shortText", value: "hi there"})
  .removeProperty("someOtherProp")
  .setPropertyValue("my prop", "hello world")
  .save(function(data, err) {
})
```


### Listeners and permissions

Properties can have Event Listeners, like onCreate, onChange and onDelete. These listeners can execute some DSL function, you define.

Permissions can be added fro access control.

> Example

```shell
# Works for /object, /template, /user
curl -X PUT "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"
- D [
  { "setPropertyPermission" : ["my prop", {"privilegeName" : {"value" : "*"}}]},
  { "removePropertyPermission" : ["my prop", "plain_user"]},
  { "setPropertyConditions" : ["my prop", "smallerThan('yxz')"] },
  { "setPropertyOnChange" : ["my prop", "email('from', 'to' , 'hi', 'i was changed')"] }
]

```
```javascript
// Works for: Object(), Template(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e")
  .setPropertyPermission("my prop", {"admin" : { "value" : "*"}})
  .removePropertyPermission("my prop", "plain_user")
  .setPropertyConditions("smallerThan('xyz')")
  .setPropertyOnChange("email('from', 'to' , 'hi', 'i was changed')")
  .save(function(data, err) {
})
```

**Nested Properties**


Nested properties (bags) are accessed via dot notation.


```shell
# Works for /object, /template, /user
curl -X PUT "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"
- D [
  { "addProperty" : {"myBag.firstItem": { type: "shortText", value: "hi there"}} },
  { "setPropertyValue" : ["myBag.firstItem", "hello world"] }
]
```
```javascript
// Works for: Object(), Template(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e")
  .addProperty({"myBag.firstItem": { type: "shortText", value: "hi there"}})
  .setPropertyValue("myBag.firstItem", "hello world")
  .save(function(data, err) {
})
```

> Response

```json
{
    "role": "object",
    "type": "my type",
    "applications": [
        "demoapp"
    ],
    "inherits": ["4iu9332423.423423"],
    "_id": "5a8e80d0e1e1282f7d3121e9",
    "name": "my name",
    "onCreate": null,
    "onDelete": null,
    "myBag": {
      "type" : "bag",
      "properties" : 
        {
          "firstItem": {
            "type" : "shortText",
            "value" : "hello world"
          }
        }
    },
    "permissions": {}
}
```

### Special Properties

### Actions


Actions are properties, that are able to execute some function.
Action properties don't hold information, but an executable SPOO DSL Snipped.
This allows for the user or the system to call methods directly on an object.


Learn more about SPOO DSL below

> Action Property 

```json
{
  "sayMyName": {
    "type" : "action",
    "value" : "email('<from>', '<to>', 'Say my name', dsl.object.name)"
  }
}
```



> Example: Call an action

```shell
# Works for /object, /template, /eventlog, /user

# Call an action
curl -X POST "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e/property/myAction/call"


```
```javascript
// Works for: Object(), Template(), EventLog(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e").Property("myAction").call(function(data, err)
{
})
```

> Response

```json
{
     "message": "action called asynchronously"
}
```



### Events


Events are special kinds of properties. They will be observed by SPOO based on a fix date or an interval. On due, SPOO automatically triggers the action, that is defined in the event.


An event can either be defined as **recurring** or **one time**.

> Recurring Event 

```javascript
{
  "reminder": {
    "type" : "event",
    "interval" : "P10D", // Every 10 days (ISO 8601 Duration)
    "action" : "email('<from>', '<to>', 'Hey', 'There')" // DSL snipped to be executed
  }
}
```

> One time Event 

```javascript
{
  "dueDate": {
    "type" : "event",
    "date" : "2018-02-21T14:14:41+00:00", // ISO 8601
    "action" : "email('<from>', '<to>', 'Hey', 'There')" // DSL snipped to be executed
  }
}
```

> Event Methods

```shell
# Works for /object, /template, /user
curl -X PUT "URL.com/api/client/myCompany/app/demoapp/object/5a818c47d3ere54a747bfa8e"
- D [
  { "addProperty" : { "my first event": { type: "event", "date": "2018-02-21T14:14:41+00:00", "action" : "email('from', 'to', 'hi', 'i just happened')"}} },
  
  { "setEventDate" : ["my first event", "2019-02-21T14:14:41+00:00"] }, // fix date
    // or
  { "setEventInterval" : ["my second event", "P30D"] }, // recurring

  { "setEventAction" : ["my first event", "email('from', 'to', 'hi', 'i just happened, jay!')"] }
]

```
```javascript
// Works for: Object(), Template(), User()
spoo.io().Object("5a818c47d3ere54a747bfa8e")
  .addProperty({"my first event": { type: "event", date: "2018-02-21T14:14:41+00:00", action : "email('from', 'to', 'hi', 'i just happened')"}}})
  
  .setEventDate("my first event", "2019-02-21T14:14:41+00:00") // fix date
  // or
  .setEventInterval("my second event", "P30D") // recurring

  .setEventAction("my first event", "email('from', 'to', 'hi', 'i just happened, jay!')")
  .save(function(data, err) {
})
```



> Response

```json
{
    "role": "object",
    "type": "my type",
    "applications": [
        "demoapp"
    ],
    "inherits": ["4iu9332423.423423"],
    "_id": "5a8e80d0e1e1282f7d3121e9",
    "name": "my name",
    "my first event": {
        "type" : "event",
        "date" : "2019-02-21T14:14:41+00:00",
        "action" : "email('from', 'to' , 'hi', 'i just happened, jay!')"
      }
    },
    {
      "my second event": {
        "type" : "event",
        "interval" : "P30D",
        "action" : "email('from', 'to' , 'hi', 'now i am happening every 30 days')"
    },
    "permissions": {}
}
```

Events are special kinds of properties (with type: 'event'). They will be observed by the system. 


To work with events, use the following methods

<aside class="info">
To add an event, use addProperty with 'event' as property type.
<br>
To remove an Event, use removeProperty
<br>
To manage permissions, use setPropertyPermission and removePropertyPermission
</aside>

**For recurring events:**

Method | Description 
--------- | --------
***All object types, except EventLogs and Files*** | 
`setEventInterval(propName, ISO8601Duration)` | Set the interval as ISO 8601 Duration String
`setEventAction(propName, DSLSnippet)` | Set the DSL Code Snippet to be executed every time the event hits the interval

**For one time events:**

Method | Description 
--------- | --------
***All object types, except EventLogs and Files*** | 
`setEventDate(propName, ISO8601Date)` | Set the date as ISO 8601 Datestring
`setEventAction(propName, DSLSnippet)` | Set the DSL Code Snippet to be executed when the event hits the date



## Querying


Querying lets you find objects by some criteria you define.

Queries can be made in two ways:

- ***Simple Queries*** To quickly search in a key/value manner
- ***Complex Queries*** To search in a more complex and broader way

You can query object's ***metadata*** and ***properties***

For metadata queries, use the name of the attribute, e.g. `name` or `type`

For property queries, use dot-notation to access single properties, e.g. `properties.height`



### Simple Queries

```shell
# Works for /objects, /templates, /eventlogs, /files, /users
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?name=my object&type=/fir/&properties.myProp=/val/"


```
```javascript
// Works for: Objects(), Templates(), EventLogs(), Users()
spoo.io().Objects({name : "my object", "type" : "/fir/", "properties.myProp.value" : "/val/"}).get(function(data, err)
{
})
```

> Response

```json
[
  {
    ...
    "name" : "my object",
    "type" : "first object",
    "myProp": {
      "type" : "shortText",
      "value" : "this is my value"
    }
  }
  ...
]
```

Query for key/value pairs. Either match an exact value or use Regular Expressions.

Key | Value | Description
--------- | --------| --------
name | my object | Query for exact name
type | /fir/ | Query for types that have "fir" in it.
properties.myProp | /val/ | Query for property "myProp" with "val" in it

### Complex Queries

```shell
# Works for /objects, /templates, /eventlogs, /files, /users
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?$query=$or: [{name : "my object"}, {name : "not my object"} ]}"
```
```javascript
// Works for: Objects(), Templates(), EventLogs(), Users()
spoo.io().Objects({$query : { $or: [{name : "my object"}, {name : "not my object"} ]} }).get(function(data, err)
{
})
```

> Response

```json
[
  {
    ...
    "name" : "my object",
    "type" : "first object",
    "myProp": {
      "type" : "shortText",
      "value" : "this is my value"
    }
  },
  ...
]
```

This let's you run complex JSON-formatted queries with $or, $and, $in and more...
Learn more about complex query operator here...


Key | Value | Description
--------- | --------| --------
$query | {$or: [{name : "my object"}, {name : "not my object"} ]} | Perform an OR query

### Important Differences


```shell
# Works for /objects, /templates, /eventlogs, /files, /users

# simple query
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?properties.myProp=my value"

# complex query
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?$query={'properties.myProp.value' : 'my value'}"

# simple nested query
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?properties.myProp.firstItem=my value"

# complex nested query
curl -X POST "URL.com/api/client/myCompany/app/demoapp/objects?$query={'properties.myProp.properties.firstProp.value' : 'my value'}"

```

```javascript
// Works for: Objects(), Templates(), EventLogs(), Users()

// simple query
spoo.io().Objects({"properties.myProp" : "my value"}).get(function(data, err)
{
})

// complex query
spoo.io().Objects({$query = {"properties.myProp.value" : "my value"}}).get(function(data, err)
{
})

// simple nested query
spoo.io().Objects({"properties.myProp.firstItem" : "my value"}).get(function(data, err)
{
})

// complex nested query
spoo.io().Objects({$query = {"properties.myProp.properties.firstItem.value" : "my value"}}).get(function(data, err)
{
})
```

<aside class="warning">
Please note, that in complex queries, properties have to be accessed with exact dot-notation, while in simple queries they are accessed by property name only.
</aside>

Examples:

***Accessing values:***

Simple Query | Description
--------- | --------
`properties.myProp : "my value"`  | In simple queries, you only have to reference the property name. 

Complex Query | Description
--------- | --------
`properties.myProp.value : "my value"`  | In complex queries you have to specify the value attribute inside the property



***Accessing nested property values:***

Simple Query | Description
--------- | --------
`properties.myBag.firstItem : "my value"`  | In simple queries, you only have to reference the property names. 

Complex Query | Description
--------- | --------
`properties.myBag.properties.firstItem.value : "my value"`  | In complex queries you have to specify the exact path to the value



## Permissions


Access Control lets you manage what a user can do with an object. For it to work, you need two things, that are mapped together:

- A privilege (user role)
- A permission rule

Privileges are labels that can be attached to user objects. Like "admin" or "simple_user".
You are free to name these labels.


 On the other side, the object side, permissions can be modeled by mapping user privileges to a set of permissions codes. Like "admin" : "r" (A user with the "admin" privilege can read this ressource)


<aside class="info">
Important: Privileges are divided into applications. So that a user can have different privileges in different application contexts.
</aside>

<aside class="info">
Inside permissions, you can map user privileges, or use a wildcard "<b>*</b>" to refer to all privileges
</aside>

> Example user privileges

```json
{
  ...
  "privileges" : {
    "demoapp": [    // privileges are divided into apps
      {
        "name" : "admin"
      }
    ],
    "anotherapp": [   
      {
        "name" : "plain_user"
      }
    ]
}
```
> Example object permissions

```json
{
  ...
  "permissions" : 
    {
      "admin": {
        "value" : "*" // users with admin privileges can do anything
      }
    },
    {
      "*": {    
        "value" : "rpn" // all other users can only read, add properties and change the object name
      }
    }
}
```


### Permission Codes

These Codes can be combined to build permissions.


Code | Description 
--------- | ------- 
* | All Permissions
a | Add/remove an application from an object
r | Read (see) object or property 
d | Delete an object or property
n | Change the object name
o | Change username (user only)
h | Change email (user only)
t | Change the object type
i | Add/remove an inherit definition (extend a template)
v | Set onCreate handler
w | Set onChnage handler
z | Set onDelete handler
x | Change object/property permissions
p | Add/remove properties to objects
u | Update property values
m | Update property conditions and reference query
e | Execute an action property
f | Update action property (change DSL Snippet)
l | Change user privileges


## Authorisations

Authorisations allow you to define what a user can do with objects matching a specific query.

Example structure inside a user:

```json
{
  username: "user",
  authorisations: {
    '*': { // '*' is for "all apps"
      name: "do anything", // a name for the authorisation (optional)
      query: { // the query to match the objects
        name: {$regex: "te"}
      },
      perm: "crud" // the permission codes
    }
  }
}
```

Methods:

Method | Description
--------- | -------- |
`setAuthorisation({name: "", query: {...}, perm: "crud"})`  | Set a new authorisation |
`removeAuthorisation("authorisationName")`  | Removes an authorisation by its name |



### SPOO Admin

There is a special kind of privilege, called `spooAdmin`. This is a flag that is attached to a user object and can either be `true` or `false`.


A SPOO Admin is a super user and can perform any operation, regardless of permissions.  

Whe you set up your client, your initial user will be a SPOO Admin.