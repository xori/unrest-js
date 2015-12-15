'use strict';

// The Export Module

(function (exports) {
  exports.db = require('./database');
  exports.request = require('superagent');
})(typeof window !== 'undefined' ? window['dsbn'] = {} : module.exports);