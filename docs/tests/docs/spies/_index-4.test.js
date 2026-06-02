import t from "tap";
import sinon from "sinon";

t.test("spying on property getter and setter", (t) => {
  const object = {
    _property: undefined,
    get test() {
      return this._property;
    },
    set test(value) {
      this._property = value * 2;
    }
  };

  const spy = sinon.spy(object, "test", ["get", "set"]);

  // Set the property
  object.test = 42;

  // Verify setter was called
  t.ok(spy.set.calledOnce, "setter should be called once");

  // Get the property
  const result = object.test;

  // Verify getter was called and value is correct
  t.equal(result, 84, "value should be doubled");
  t.ok(spy.get.calledOnce, "getter should be called once");

  spy.get.restore();
  spy.set.restore();
  t.end();
});
