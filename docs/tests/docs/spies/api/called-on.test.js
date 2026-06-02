import t from "tap";
import sinon from "sinon";

t.test("spy.calledOn checks if called at least once with this", (t) => {
  const spy = sinon.spy();
  const object = {};

  // False before any calls
  t.notOk(spy.calledOn(object), "should be false before calls");

  // True after calling with object as this
  spy.call(object);
  t.ok(
    spy.calledOn(object),
    "should be true after calling with object as this"
  );

  t.end();
});
