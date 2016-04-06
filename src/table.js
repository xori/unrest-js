var Request = require('./request');
var Query = require('./query');

module.exports = class Table extends Query {
    constructor (database, table) {
      super();
      this._database = database;
      this.url = database.url + table;
      this.name = table;
      this.events = {};
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

    cacheable (obj) {
      return new Request(this).cacheable(obj);
    }
};
