/*global describe, it */
var assert = require('assert');
var LocalStorage = require('node-localstorage').LocalStorage;
global.localStorage = new LocalStorage('./scratch');

var DB = require('../dist/node/main');
var _base = 'http://localhost:35683/api';

describe('Database', function () {
  var db = new DB(_base);

  describe('constructor', function () {
    it('should set the url correctly', function () {
      var table = db('myTable');
      assert.equal(table.url, _base + '/myTable');
    });
  });

  it('should query (GET)', function (done) {
    db('values').query()
      .then(function (data) {
        assert(data.length > 1, 'data did not contain any entries');
        done();
      }).catch(function (err) {
        assert.fail(err, 'network error');
      });
  });

  it('should fetch (GET)', function (done) {
    db('values').fetch(1)
      .then(function (data) {
        assert(data.Id === 1, 'was not correct object ' + JSON.stringify(data));
        done();
      }).catch(function (err) {
        assert.fail(err, 'network error');
      });
  });

  it('should POST new data', function (done) {
    var mydata = { Name: 'Joe' };
    db('values').save(mydata)
      .then(function (data) {
        assert.equal(data.Name, mydata.Name);
        assert(!!data.Id);
        db('values').fetch(data.Id)
          .then(function (confirm) {
            assert.deepEqual(confirm, data);
            done();
          }).catch(function (err) {
            assert.fail(err, err.Message);
          });
      }).catch(function (err) {
        assert.fail(err, err.Message);
      });
  });

  it('should PUT existing data', function (done) {
    var mydata = { Id: 1, Name: 'Joe' };
    db('values').save(mydata)
      .then(function () {
        db('values').fetch(1)
        .then(function (confirm) {
          assert.deepEqual(confirm, mydata);
          done();
        }).catch(function (err) {
          assert.fail(err, err.Message);
        });
      }).catch(function (err) {
        assert.fail(err, err.Message);
      });
  });

  // This test creates a new row, deletes it, then attempts to GET it again
  //   to confirm delete.
  it('should DELETE existing data', function (done) {
    var mydata = { Name: 'DeleteTest' };
    db('values').save(mydata)
      .then(function (data) {
        db('values').remove(data.Id)
          .then(function () {
            db('values').fetch(data.Id)
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
  var db = new DB(_base, {
    cacheByDefault: true,
    storage: global.localStorage
  });

  it('should function', function (done) {
    db('values').fetch(1).cacheable(2000).catch(function (err) {
      assert.fail('couldnt even get fetch data the first time ' + err);
    }).then(function (data) {
      db('values').fetch(1).cacheable(2000)
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
