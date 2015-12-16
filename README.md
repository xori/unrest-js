# Unrest <small>a vanilla javascript rest api</small>

A client side rest api with cache that just works as you'd expect.

## Installation
```sh
bower install -Sp unrest
```

## Usage
```javascript
var db = new Unrest('/api', {
  cacheTTL: 5 * 60 * 1000,
  cacheByDefault: false,
  storage: localStorage
});

// List querying
// GET /api/TableName
db('TableName')
  .query({name: 'Evan%'})
  .cacheable(5 * 24 * 60 * 60 * 1000) // 5 days
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
  .fetch(53)
  .cacheable(5 * 60 * 1000) // 5 minutes
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
