# Unrest <font size=4 color="#aaa">a vanilla javascript rest api</font>

A client side rest api with cache that works *for you* not against you.

## Installation
```sh
bower install -Sp unrest
# or
npm install --save unrest
```

## Usage

### Initialization
```javascript
// if you're in node
var Unrest = require('unrest');

var db = new Unrest('/api', {
  cacheTTL: 10 * 60 * 1000, // 10 minutes default
  cacheByDefault: false, // false by default
  storage: localStorage // if in node do below
  //       new require('node-localstorage').LocalStorage('./scratch');
});
```

### GET Listing
```javascript
// GET /api/TableName?name=Evan%
// Returns Array
db('TableName')
  .cacheable(5 * 24 * 60 * 60 * 1000) // 5 days
  .query({name: 'Evan%'})
  .then((data, cache) => {
    // function will run twice. Once for cache with cache=true, then again when
    //  the live data comes in, with cache=false
  }).catch(err => {
    // err: String, server error
    // cache: Object, the old object
  });
```

### GET Value
```javascript
// GET /api/TableName/53
db('TableName')
  .cacheable(5 * 60 * 1000) // 5 minutes
  .fetch(53)
  .then(...).catch(...);
```

### POST/PUT Create and Save
Rather than having separate functions unrest shares the `.save()` function. If
the object passed in has an `.id` or `.Id` property, it will be sent to the
server under a `PUT` request. Otherwise it assumes it is creating that object
and sends it under a `POST`.
```javascript
// Save item
// POST/PUT /api/TableName(/53)?
data = { Id: 53, Name: 'Evan' }
db('TableName').save(data)
  .then(...)
  .catch(...);
```

### DELETE Value
```javascript
// DELETE /api/TableName/53
db('TableName').remove(53)
  .then(...).catch(...)
```

### Pseudo Synchronous Result
In client side frameworks like Angular and Vue who default undefined/null to
empty strings it is beneficial to have properties set themselves on the returned
object once the request resolved.

```javascript
$scope.mydata = db('TableName').fetch(52);
```

then in your view template

```html
<div ng-show="mydata.error">{{mydata.error.message}}</div>
<div>
  My Id is {{mydata.Id}} and name is {{mydata.Name}}
</div>
```

** Note: ** The exception to this rule is the `.query()` function as that
returns an array. In this case the results are assigned to the `.data` property.
This is also the case if the result is a primitive value, like `5` or
`'steven'`.

### Handing Errors
In the event of an error, the `.catch` function will be called. The function
expects a callback that takes a *single* argument, the error object.

```javascript
db('TableName').fetch(404).catch(function(err) {
  console.log(err.status, err.response.body); // 404 "Object not found"
})
```

### Dealing with the Cache
Unrest enables an easy caching solution, simply call the `.cacheable(<int>)`
function and any **exactly** similar requests will be instantly populated from
`localStorage` with the `.then` parameter `cache` set to true.

Once the request completes in earnest, the `.then` parameter `cache` will be set
to a falsey value.

```javascript
db('TableName')
  .cacheable(15000)
  .fetch(52)
  .then(function(data, cache) {
    // will run twice
    if(cache) {
      // I'm being pulled from localStorage
      // I get called first.
    } else {
      // I arrived from the server.
      // I get called second.
    }
  });
```

When [initializing](#Initialization) unrest you can pass the following parameters
into the config object.

- `cacheTTL`: (10 minutes by default) The default time for the cache to be
  invalid.
- `cacheByDefault`: (`false` by default) If true, every request will be cached
  for the `cacheTTL` amount of time unless overridden with `.cacheable()`.
- `storage`: (`localStorage` by default) Where the cache is saved and pulled
  from, you can also use `sessionStorage`.

## Contributing

Contributions welcome.

#### Build Minified
    npm run build;

#### Build <small>(all-the-time)</small>; Test <small>(all-the-time)</small>
```sh
npm install; gulp;
# I currently don't test all the time...
gulp test # for that.
```
