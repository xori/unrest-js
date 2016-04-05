# Unrest <small>a vanilla javascript rest api</small>

A client side rest api with cache that works *for you* not against you.

## Installation
```sh
bower install -Sp unrest
# or
npm install --save unrest
```

## Usage
```javascript
// if you're in node
var Unrest = require('unrest');

var db = new Unrest('/api', {
  cacheTTL: 10 * 60 * 1000, // 10 minutes default
  cacheByDefault: false, // false by default
  storage: localStorage // if in node do below
  //       new require('node-localstorage').LocalStorage('./scratch');
});

// List querying
// GET /api/TableName?name=Evan%
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

// Single query
// GET /api/TableName/53
db('TableName')
  .cacheable(5 * 60 * 1000) // 5 minutes
  .fetch(53)
  .then(...).catch(...);

// Save item
// POST/PUT /api/TableName(/53)?
data = { Id: 53, Name: 'Evan' }
db('TableName').save(data)
  .then(...)
  .catch(...);

db('TableName').remove(53)
  .then(...).catch(...)

// Live querying with Signlr
// NOT IMPLEMENTED
db('Table')
  .on('insert', (new, data) => {
    // insert into template $scope.model
  }).on('delete', (removed, data) => {
    // remove item
  }).on('update', (changed, data) => {
    // splice model
  });
```

## Building

#### Build Minified
    npm run build;

#### Build <small>(all-the-time)</small>; Test <small>(all-the-time)</small>
```sh
npm install; gulp;
# I currently don't test all the time...
gulp test # for that.
```
