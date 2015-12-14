'use strict';

// The Export Module
var globals = null;
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  globals = module.exports;
} else {
  globals = window.DSBN = {};
}

(function () {
  this.db = require('./database');
  this.request = require('superagent');
}).call(globals);