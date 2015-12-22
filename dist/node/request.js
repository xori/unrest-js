'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var xhr = require('superagent');

function jsonify(agent) {
  return agent.type('application/json').accept('json');
}

function handleResponses(request) {
  request.status = 'pending';
  var method = request.agent.method;
  var url = request.agent.url;
  var CACHE_KEY = 'unrest-' + method + '-' + url;
  var storageProvider = request.table._database.storage;

  // //
  // Perform Cache
  if (request.cache) {
    var cache = JSON.parse(storageProvider.getItem(CACHE_KEY));

    if (cache) {
      // if the cache exists and isn't old
      if (cache.time && cache.time > +new Date() - request.cache) {
        request.onSuccess.forEach(function (cb) {
          cb(cache.data, true);
        });
      } else {
        storageProvider.removeItem(CACHE_KEY);
      }
    }
  }

  // //
  // Handle Response
  request.agent.end(function (err, res) {
    request.status = 'resolved';
    if (err) {
      // on error
      request.error = err;
      request.onError.forEach(function (cb) {
        cb(err);
      });
    } else {
      // on success
      request.data = res.body;
      if (request.cache) {
        storageProvider.setItem(CACHE_KEY, JSON.stringify({ time: +new Date(), data: request.data }));
      }
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
    if (this.table._database.cacheByDefault) {
      this.cache = this.table._database.cacheTTL;
    }
  }

  _createClass(Request, [{
    key: 'cacheable',
    value: function cacheable(lifetime) {
      if (!lifetime) {
        lifetime = this.table._database.cacheTTL;
      }
      this.cache = lifetime;
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
    value: function save(obj) {
      var r = null;
      var id = obj.Id || obj.id;
      if (!id || id === 0) {
        r = xhr.post(this.table.url);
      } else {
        r = xhr.put(this.table.url + '/' + id);
      }
      this.agent = r.send(obj);
      jsonify(this.agent);
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(Id) {
      this.agent = xhr.del(this.table.url + '/' + Id);
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