var Request = require('./request');

module.exports = class Table {
    constructor (database, table) {
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
};
