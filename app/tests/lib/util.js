import * as util from 'lib/util';

let doc = document;

describe("lib/util", () => {

  describe("uniqId()", () => {
    it("creates 1000 unique keys.", () => {
      let set = new Set(util.times(1000, util.uniqId));
      set.size.should.eql(1000);
    });
  });

  describe("last()", () => {
    it("returns the last element in an array.", () => {
      util.last([1, 2]).should.eql(2);
      util.last([2]).should.eql(2);
    });
    it("returns undefined if the array has no elments..", () => {
      (typeof util.last([])).should.eql('undefined');
    });
  });

  describe("initial()", () => {
    it("returns everything but the last item in an array", () => {
      util.initial([1, 2]).should.eql([1]);
      util.initial([1, 2, 3]).should.eql([1, 2]);
    });
    it("returns an empty array if the array is size 1.", () => {
      util.initial([1]).should.eql([]);
    });
    it("returns an empty array if the array is empty.", () => {
      util.initial([]).should.eql([]);
    });
  });

  describe("each()", () => {
    it("iterates over an object.", () => {
      let vals = [];
      let keys = [];
      util.each({a:1, b:2}, (val, key) => {
        vals.push(val);
        keys.push(key);
      });
      vals.should.eql([1, 2]);
      keys.should.eql(['a', 'b']);
    });
    it("Fails silently on receiving undefined or null.", () => {
      (() => {
        util.each(undefined, () => {});
      }).should.not.throw();
    });
  });

  describe("times()", () => {
    it("calls a function 5 times.", () => {
      let i = 0;
      util.times(5, () => i++);
      i.should.eql(5);
    });
    it("calls with the index.", () => {
      let list = [];
      util.times(4, (i) => list.push(i));
      list.should.eql([0, 1, 2, 3]);
    });
  });

  describe("requireProps()", () => {
    it("does not throw an error on providing properties.", () => {
      let obj = {foo: 1, bar: 2};
      util.requireProps.bind(null, obj, ['foo']).should.not.throw();
      util.requireProps.bind(null, obj, ['foo', 'bar']).should.not.throw();
    });
    it("throws an error on not providing properties.", () => {
      let obj = {foo: 1, bar: 2};
      util.requireProps.bind(null, obj, ['qux']).should.throw();
    });
  });

  describe("constrain()", () => {
    it("returns a number within its proper range.", () => {
      util.constrain(5, [0, 10]).should.eql(5);
    });
    it("forces a minimum.", () => {
      util.constrain(-1, [0, 10]).should.eql(0);
    });
    it("forces a maximum.", () => {
      util.constrain(100, [0, 10]).should.eql(10);
    });
  });

  describe("fireOnce()", () => {
    it("triggers an event handler only once.", () => {
      let el = doc.createElement('button');
      let i = 0;
      util.fireOnce(el, 'click', () => i++);
      el.click();
      el.click();
      i.should.eql(1);
    });
  });

  describe("capitalize()", () => {
    it("Does nothing when passed an empty string.", () => {
      util.capitalize('').should.eql('');
    });
    it("Capitalizes a single letter.", () => {
      util.capitalize('a').should.eql('A');
    });
    it("Capitalizes a string.", () => {
      util.capitalize('foo').should.eql('Foo');
    });
    it("Capitalizes only the first character of a multi-word string..", () => {
      util.capitalize('foo foo').should.eql('Foo foo');
    });
  });

  describe("titleCase()", () => {
    it("title cases a word.", () => {
      util.titleCase('hello').should.eql('Hello');
    });
    it("title cases more than one word.", () => {
      util.titleCase('hey you there').should.eql('Hey You There');
    });
    it("title cases and provides a custom separator.", () => {
      util.titleCase('foo,bar,qux', ',').should.eql('Foo,Bar,Qux');
    });
  });

  describe("ifn", () => {
    it("returns a value on a true condition.", () => {
      util.ifn(true, 1).should.eql(1);
    });
    it("returns a different value on a false condition.", () => {
      util.ifn(false, 1, 2).should.eql(2);
    });
  });

  describe("without()", () => {
    it("Removes keys from an object.", () => {
      util.without({a:1, b:2, c:3}, 'c').should.eql({a:1, b:2})
      util.without({a:1, b:2, c:3}, ['a']).should.eql({b:2, c:3})
      util.without({a:1, b:2, c:3}, ['a', 'b']).should.eql({c:3})
      util.without({a:1, b:2, c:3}, ['a', 'b', 'c']).should.eql({})
    });
  });

  describe("copy()", () => {
    it("Creates a shallow copy of an object.", () => {
      let a = {a: 1};
      let b = util.copy(a);
      b.a = 2;
      a.a.should.eql(1);
    });
  });

  describe("keys()", () => {
    it("Returns the keys of an object.", () => {
      util.keys({}).should.eql([]);
      util.keys({a:1, b:2}).should.eql(['a', 'b']);
    });
  });

  describe("values()", () => {
    it("Returns the values of an object.", () => {
      util.values({}).should.eql([]);
      util.values({a:1, b:2}).should.eql([1, 2]);
    });
  });

  describe("filterMap()", () => {
    it("Filters and maps an array.", () => {
      util.filterMap([], () => {}).should.eql([]);
      util.filterMap([1, 2, 3, 4, 5], (val) => {
        if (val > 2)
          return val.toString();
      }).should.eql(['3', '4', '5']);
    });
  });

  describe("toggleState()", () => {
    let model;
    beforeEach(() => {
      model = {
        setState: (state) => Object.assign(model.state, state),
        state: {cool: false}
      };
    });
    it("Toggles a model property.", () => {
      util.toggleState(model, 'cool');
      model.state.cool.should.be.true;
      util.toggleState(model, 'cool');
      model.state.cool.should.be.false;
    });
    it("Returns the new value of the toggled property.", () => {
      util.toggleState(model, 'cool').should.be.true;
      util.toggleState(model, 'cool').should.be.false;
      util.toggleState(model, 'cool').should.be.true;
    });
  });

  describe("throttle()", () => {
    it("Calls a function twice in succession, but only executes it once.", () => {
      let spy = 0;
      let fn = () => spy++;
      let fn2 = util.throttle(fn, 100);
      fn2();
      fn2();
      spy.should.eql(1);
    });
  });

});
