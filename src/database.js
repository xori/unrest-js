var Request = require('./request');

module.exports = class Database {
  constructor (name) {
    this.url = name || '/api/';
    var self = this;
    return table => {
      return new Table(self, table);
    };
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
}
