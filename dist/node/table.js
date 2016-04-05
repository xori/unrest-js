'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = require('./request');

module.exports = (function () {
  function Table(database, table) {
    _classCallCheck(this, Table);

    this._database = database;
    this.url = database.url + table;
    this.name = table;
    this.events = {};
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
  }, {
    key: 'remove',
    value: function remove(obj) {
      return new Request(this).remove(obj);
    }
  }, {
    key: 'cacheable',
    value: function cacheable(obj) {
      return new Request(this).cacheable(obj);
    }
  }]);

  return Table;
})();