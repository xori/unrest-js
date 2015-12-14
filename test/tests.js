/*global describe, it */
var assert = require('assert');
var DB = require('../dist/node/main').db;

describe('Database', function () {
  describe('constructor', function () {
    var _base = 'http://localhost:35683/api';
    var db = new DB(_base);

    it('should set the url correctly', function () {
      var table = db('myTable');
      assert.equal(table.url, _base + '/myTable');
    });

    it('should do queries', function (done, fail) {
      db('values').query()
        .then(function () {
          done();
        }).catch(fail);
    });
  });
});
