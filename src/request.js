var xhr = require('superagent');
var odata = require('./odata');

function jsonify(agent) {
  return agent.type('application/json')
    .accept('json');
}

function handleResponses(request) {
  request._status = 'pending';
  request.pending = true;
  var method = request._agent.method;
  var url = request._agent.url;
  const CACHE_KEY = 'unrest-' + method + '-' + url;
  var storageProvider = request._table._database.storage;

  // //
  // Perform Cache
  if (request._cache) {
    var cache = JSON.parse(storageProvider.getItem(CACHE_KEY));

    if (cache) {
      // if the cache exists and isn't old
      if (cache.time && request._cache > +(new Date()) - cache.time) {
        request._onSuccess.forEach(function(cb) {
          cb(cache.data, true);
        });
        request._cachedata = cache.data;
      } else {
        storageProvider.removeItem(CACHE_KEY);
      }
    }
  }

  // //
  // Handle Response
  request._agent.end(function(err, res) {
    request._status = 'resolved';
    delete request.pending;
    if (err) { // on error
      request.error = err;
      // debugger;
      request._onError.forEach(function(cb) {
        cb(err);
      });
    } else { // on success
      request._data = res.body;
      if (request._cache) {
        storageProvider.setItem(CACHE_KEY, JSON.stringify({
          time: +new Date(),
          data: request._data
        }));
      }
      // //
      // perform injection
      if (typeof(res.body) === 'object' && !Array.isArray(res.body)) {
        for (var prop in request._data) {
          request[prop] = request._data[prop];
        }
      } else {
        request.data = request._data;
      }
      // //
      // perform calbacks.
      request._onSuccess.forEach(function(cb) {
        cb(res.body);
      });
    }
    if( request._table._database.onEnd ) request._table._database.onEnd();

  });
}

module.exports = class Request {
  constructor(table) {
    this._table = table;
    this._status = 'idle';
    this._onSuccess = [];
    this._onError = [];
    if (this._table._database.cacheByDefault) {
      this._cache = this._table._database.cacheTTL;
    }
  }

  cacheable(lifetime) {
    if (this._status !== 'idle' && this._status !== 'pending') {
      console.error('cacheable could not be set before request was sent out. Ensure this is called before query, fetch, save, then, etc');
    }
    if (!lifetime) {
      lifetime = this._table._database.cacheTTL;
    }
    this._cache = lifetime;
    return this;
  }

  odata() {
    return this._table._database.odata;
  }

  resource(id) {
    id = id.toString();
    return this._table.url + (this.odata() ? '(' + id + ')' : '/' + id);
  }
  // QUERY GET /table/
  // Returns a list.
  query(options) {
    this._agent = xhr
      .get(this._table.url
        + ( this.odata() ? "?" + (new odata(this._table._query)).toString() : ""))
      .query(options);
    jsonify(this._agent);
    if (this._status === 'idle') handleResponses(this);
    return this;
  }

  fetch(id, options) {
    this._agent = xhr
      .get( this.resource(id) )
      .query(options);
    jsonify(this._agent);
    if (this._status === 'idle') handleResponses(this);
    return this;
  }

  save(obj) {
    var r = null;
    var id = obj.Id || obj.id;
    if (!id || id === 0) {
      r = xhr.post(this._table.url);
    } else {
      r = xhr.put(this.resource(id));
    }
    this._agent = r.send(obj);
    jsonify(this._agent);
    if (this._status === 'idle') handleResponses(this);
    return this;
  }

  remove(Id) {
    this._agent = xhr.del(this.resource(Id));
    jsonify(this._agent);
    if (this._status === 'idle') handleResponses(this);
    return this;
  }

  then(cb) {
    if (this._status === 'resolved' && !this.error) {
      cb(this._data);
    } else {
      this._onSuccess.push(cb);
    }
    if (this._status === 'idle') handleResponses(this);
    if (this._status === 'pending' && this._cachedata) {
      cb(this._cachedata, true);
    }
    return this;
  }

  catch (cb) {
    if (this._status === 'resolved' && this.error) {
      cb(this.error);
    } else {
      this._onError.push(cb);
    }
    if (this._status === 'idle') handleResponses(this);
    return this;
  }

  status() {
    return this._status;
  }
};
