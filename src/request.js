var xhr = require('superagent');

function jsonify (agent) {
  return agent.type('application/json')
    .accept('json');
}

function handleResponses (request) {
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

module.exports = class Request {
  constructor (table) {
    this.table = table;
    this.status = 'idle';
    this.onSuccess = [];
    this.onError = [];
  }

  cacheable () {
    this.cacheable = true;
    return this;
  }

  // QUERY GET /table/
  // Returns a list.
  query (options) {
    this.agent = xhr
      .get(this.table.url)
      .query(options);
    jsonify(this.agent);
    return this;
  }

  fetch (id, options) {
    this.agent = xhr
      .get(this.table.url + '/' + id.toString())
      .query(options);
    jsonify(this.agent);
    return this;
  }

  save (object) {
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

  then (cb) {
    if (this.status === 'resolved' && !this.error) {
      cb(this.data);
    } else {
      this.onSuccess.push(cb);
    }
    if (this.status === 'idle') handleResponses(this);
    return this;
  }

  catch (cb) {
    if (this.status === 'resolved' && this.error) {
      cb(this.error);
    } else {
      this.onError.push(cb);
    }
    if (this.status === 'idle') handleResponses(this);
    return this;
  }
};
