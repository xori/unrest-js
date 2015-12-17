'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global localStorage */
var Table = require('./table');

module.exports = function Database(name, options) {
  _classCallCheck(this, Database);

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
  var _database = function _database(table) {
    return new Table(self, table);
  };
  // `public` functions
  this.plugins.forEach(function (plugin) {
    plugin.call(self);
  });

  return _database;
};