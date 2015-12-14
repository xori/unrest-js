'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = require('./request');

module.exports = function Database(name) {
  _classCallCheck(this, Database);

  this.url = name || '/api/';
  if (!this.url.endsWith('/')) {
    this.url += '/';
  }
  var self = this;
  var _database = function _database(table) {
    return new Table(self, table);
  };
  // `public` functions
  _database.x = 5;
  _database.y = function () {};
  return _database;
};

var Table = (function () {
  function Table(database, table) {
    _classCallCheck(this, Table);

    this._database = database;
    this.url = database.url + table;
    this.name = table;
  }

  _createClass(Table, [{
    key: 'query',
    value: function query(options) {
      return new Request(this).query(options);
    }
  }, {
    key: 'fetch',
    value: function fetch(id) {
      return new Request(this).fetch(id);
    }
  }, {
    key: 'save',
    value: function save(object) {
      return new Request(this).save(object);
    }
  }]);

  return Table;
})();