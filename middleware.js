class Middleware {

  constructor() {

    if (!Array.prototype.last) {
      Array.prototype.last = function() {
        return this[this.length - 1];
      }
    }

    if (!Array.prototype.reduceOneRight) {
      Array.prototype.reduceOneRight = function() {
        return this.slice(0, -1);
      }
    }

  }

  use(fn) {
    this.go = ((stack) => (...args) => stack(...args.reduceOneRight(), () => {
      let _next = args.last();
      fn.apply(this,
               [...args.reduceOneRight(),
               _next.bind.apply(_next, [null, ...args.reduceOneRight()]
             )]);
    }))(this.go);
  }

  go(...args) {
    let _next = args.last();
    _next.apply(this, args.reduceOneRight());
  }

}

module.exports = Middleware
