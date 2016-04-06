'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Request = require('./request');
var Query = require('./query');

module.exports = (function (_Query) {
  _inherits(Table, _Query);

  function Table(database, table) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Table).call(this));

    _this._database = database;
    _this.url = database.url + table;
    _this.name = table;
    _this.events = {};
    return _this;
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
})(Query);