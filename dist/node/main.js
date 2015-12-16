'use strict';

// The Export Module
global.Unrest = require('./database');
global.Unrest.superagent = require('superagent');

module.exports = global.Unrest;