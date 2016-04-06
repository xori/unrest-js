/*global describe, it, before, after */
var assert = require('assert');
var LocalStorage = require('node-localstorage').LocalStorage;
var jsonServer = require('json-server');
global.localStorage = new LocalStorage('./scratch');

var DB = require('../dist/node/main');
var fail = function (err) { assert.fail(err); };
var _base = 'http://localhost:3210';
var server = jsonServer.create();
var db;

server.use(jsonServer.router({
  posts: [
    {id: 1, title: 'hello world'}
  ],
  simple: [ 5 ]
}));
var end = server.listen(3210);

describe('Basic Usage', function () {
  before(function () {
    db = new DB(_base);
  });

  describe('Underlying Request Library', function () {
    it('should set the url correctly', function () {
      var table = db('myTable');
      assert.equal(table.url, _base + '/myTable');
    });
  });

  it('should query (GET)', function (done) {
    db('posts').query()
      .then(function (data) {
        assert(data.length > 0, 'data did not contain any entries');
        done();
      }).catch(function (err) {
        assert.fail(err, 'network error');
      });
  });

  it('should fetch (GET)', function (done) {
    db('posts').fetch(1)
      .then(function (data) {
        assert(data.id === 1, 'was not correct object ' + JSON.stringify(data));
        done();
      }).catch(function (err) {
        assert.fail(err, 'network error');
      });
  });

  it('should POST new data', function (done) {
    var mydata = { title: 'Hello to Joe' };

    db('posts').save(mydata)
      .then(function (data) {
        assert(!!data.id, 'was not given an id');
        db('posts').fetch(data.id)
        .then(function () {
          done();
        }).catch(fail);
      }).catch(fail);
  });

  it('should PUT existing data', function (done) {
    var mydata = { id: 1, title: 'Joe' };
    db('posts').save(mydata)
      .then(function (data) {
        assert.equal(data.title, 'Joe', 'PUT didn\'t save');
        done();
      }).catch(function (err) {
        assert.fail(err, err.Message);
      });
  });

  // This test creates a new row, deletes it, then attempts to GET it again
  //   to confirm delete.
  it('should DELETE existing data', function (done) {
    var mydata = { Name: 'DeleteTest' };
    db('posts').save(mydata)
      .then(function (data) {
        db('posts').remove(data.id)
          .then(function () {
            db('posts').fetch(data.id)
              .then(function () {
                assert.fail('item was not deleted.');
              })
              .catch(function () {
                done();
              });
          })
          .catch(function (err) {
            assert.fail('delete failed to complete. ' + err);
          });
      })
      .catch(function (err) {
        assert.fail('save failed to complete. ' + err);
      });
  });
});

describe('Cache', function () {
  before(function () {
    db = new DB(_base, {
      cacheByDefault: true,
      storage: global.localStorage
    });
  });

  it('should cache', function (done) {
    db('posts').cacheable(2000).fetch(1).catch(function (err) {
      assert.fail('couldnt even get fetch data the first time ' + err);
    }).then(function (data, cache) {
      db('posts').cacheable(2000).fetch(1)
        .then(function (data, cache) {
          if (cache) {
            assert.deepEqual(data, data, '');
            done();
          }
        }).catch(function (err) {
          assert.fail('couldnt fetch data the 2nd time ' + err);
        });
    });
  });
});

describe('Pseudo Synchronous Response', function () {
  after(function () {
    end.close();
  });

  before(function () {
    db = new DB(_base);
  });

  describe('inject the results', function () {
    it('if an object', function (done) {
      var result = db('posts').fetch(1);
      result.then(function (data) {
        assert(result.title);
        done();
      });
    });
    it('if an array', function (done) {
      var result = db('posts').query();
      result.then(function (data) {
        assert(!result.title);
        assert(result.data.length > 0);
        done();
      });
    });
  });
});
