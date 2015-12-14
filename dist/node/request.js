'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var xhr = require('superagent');

function jsonify(agent) {
  return agent.type('application/json').accept('json');
}

function handleResponses(request) {
  request.status = 'pending';
  // TODO handle request.cacheable;
  request.agent.end(function (err, res) {
    request.status = 'resolved';
    if (err) {
      request.error = err;
      request.onError.forEach(function (cb) {
        cb(res.err);
      });
    } else {
      request.data = res.body;
      request.onSuccess.forEach(function (cb) {
        cb(res.body);
      });
    }
  });
}

module.exports = (function () {
  function Request(table) {
    _classCallCheck(this, Request);

    this.table = table;
    this.status = 'idle';
    this.onSuccess = [];
    this.onError = [];
  }

  _createClass(Request, [{
    key: 'cacheable',
    value: function cacheable() {
      this.cacheable = true;
      return this;
    }

    // QUERY GET /table/
    // Returns a list.

  }, {
    key: 'query',
    value: function query(options) {
      this.agent = xhr.get(this.table.url).query(options);
      jsonify(this.agent);
      return this;
    }
  }, {
    key: 'fetch',
    value: function fetch(id, options) {
      this.agent = xhr.get(this.table.url + '/' + id.toString()).query(options);
      jsonify(this.agent);
      return this;
    }
  }, {
    key: 'save',
    value: function save(object) {
      var r = null;
      if (!object.id || object.id === 0) {
        r = xhr.post(this.table.url);
      } else {
        r = xhr.put(this.table.url + '/' + object.id);
      }
      this.agent = r.save(object);
      jsonify(this.agent);
      return this;
    }
  }, {
    key: 'then',
    value: function then(cb) {
      if (this.status === 'resolved' && !this.error) {
        cb(this.data);
      } else {
        this.onSuccess.push(cb);
      }
      if (this.status === 'idle') handleResponses(this);
      return this;
    }
  }, {
    key: 'catch',
    value: function _catch(cb) {
      if (this.status === 'resolved' && this.error) {
        cb(this.error);
      } else {
        this.onError.push(cb);
      }
      if (this.status === 'idle') handleResponses(this);
      return this;
    }
  }]);

  return Request;
})();