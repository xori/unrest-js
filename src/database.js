/* global localStorage */
var Request = require('./request');

module.exports = class Database {
  constructor (name, options) {
    this.url = name || '/api/';
    if (!this.url.endsWith('/')) {
      this.url += '/';
    }

    options = options | {};
    this.cacheTTL = options.cacheTTL || 10 * 60 * 1000; // 10 minutes
    this.cacheByDefault = options.cacheByDefault || false;
    this.storage = options.storage || localStorage;

    var self = this;
    var _database = function (table) {
      return new Table(self, table);
    };
    // `public` functions
    _database.x = 5;
    _database.y = function () {};
    return _database;
  }
};

class Table {
    constructor (database, table) {
      this._database = database;
      this.url = database.url + table;
      this.name = table;
    }

    query (options) {
      return new Request(this).query(options);
    }

    fetch (id) {
      return new Request(this).fetch(id);
    }

    save (object) {
      return new Request(this).save(object);
    }

    remove (obj) {
      return new Request(this).remove(obj);
    }
}
