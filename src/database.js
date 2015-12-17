/* global localStorage */
var Table = require('./table');

module.exports = class Database {
  constructor (name, options) {
    this.url = name || '/api/';
    if (!this.url.match(/\/$/)) {
      this.url += '/';
    }

    options = options | {};
    this.cacheTTL = options.cacheTTL || 10 * 60 * 1000; // 10 minutes
    this.cacheByDefault = options.cacheByDefault || false;
    this.storage = options.storage || localStorage;
    this.plugins = options.plugins || [];

    var self = this;
    var _database = function (table) {
      return new Table(self, table);
    };
    // `public` functions
    this.plugins.forEach(plugin => {
      plugin.call(self);
    });

    return _database;
  }
};
