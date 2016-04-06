module.exports = class Query {
  constructor() {
    this._query = {
      order: [],
      select: [],
      where: [],
      skip: null,
      take: null
    }
  }
  orderBy(...args) {
    args.forEach(arg => {
      this._query.order.push([
        arg[0] == '-' ? arg.substring(1, arg.length) : arg,
        arg[0] == '-' ? 'desc' : 'asc'
      ]);
    })
    return this;
  }
  select(...args) {
    args.forEach(arg => {
      this._query.select.push(arg);
    })
    return this;
  }
  where(pred) {
    this._query.where.push(pred);
    return this;
  }
  skip(amount) {
    this._query.skip = amount;
    return this;
  }
  take(amount) {
    this._query.take = amount;
    return this;
  }
};
