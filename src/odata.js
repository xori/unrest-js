var parser = require('odata-filter-parser');

module.exports = class Odata {
  constructor(query) {
    this._query = query;
  }
  toString() {
    var g = [],
      q = this._query;
    console.log(q);
    if (q.order.length > 0) {
      var b = "$orderby=";
      q.order.forEach(i => {
        b += i[0] + (i[1] == "desc" ? " desc" : "") + ",";
      });
      b = b.substring(0, b.length - 1);
      g.push(b);
    }
    if (q.skip) g.push("$skip=" + parseInt(q.skip));
    if (q.take) g.push("$top=" + parseInt(q.take));
    if (q.where.length > 0) {
      var b = "$filter=";
      q.where.forEach(i => {
        b += (new parser.Predicate(i)).serialize() + " and ";
      })
      b = b.substring(0, b.length - 5);
      g.push(b);
    }
    if (q.select.length > 0) g.push("$select=" + q.select.join(","));
    return g.join("&");
  }
};
