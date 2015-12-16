'use strict';

// The Export Module

(function (exports) {
  exports.Unrest = require('./database');
  exports.Unrest.superagent = require('superagent');
})(typeof window !== 'undefined' ? window = {} : module.exports);