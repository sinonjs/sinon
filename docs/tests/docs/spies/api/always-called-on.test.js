import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysCalledOn checks if always called with this", (t) => {
  const spy = sinon.spy();
  const object = {};
  const aDifferentObject = {};

  // False before any calls
  t.notOk(spy.alwaysCalledOn(object), "should be false before calls");

  // True after first call with object as this
  spy.call(object);
  t.ok(spy.alwaysCalledOn(object), "should be true after one matching call");

  // Still true after second call with same this
  spy.call(object);
  t.ok(spy.alwaysCalledOn(object), "should stay true with consistent this");

  // False after call with different this
  spy.call(aDifferentObject);
  t.notOk(
    spy.alwaysCalledOn(object),
    "should be false after inconsistent call"
  );

  t.end();
});
