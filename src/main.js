// The Export Module
window.DSBN = window.DSBN || {};

(function () {
  this.db = require('./database');
  this.request = require('superagent');
}).call(window.DSBN);
