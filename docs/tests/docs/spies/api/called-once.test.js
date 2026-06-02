import t from "tap";
import sinon from "sinon";

t.test("spy.calledOnce is true only when called exactly once", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.calledOnce, false, "should be false before any calls");

  // True after first call
  f();
  t.equal(f.calledOnce, true, "should be true after one call");

  // False after second call
  f();
  t.equal(f.calledOnce, false, "should be false after two calls");

  t.end();
});
