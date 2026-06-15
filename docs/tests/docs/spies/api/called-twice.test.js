import t from "tap";
import sinon from "sinon";

t.test("spy.calledTwice is true only when called exactly twice", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.calledTwice, false, "should be false before any calls");

  // False after first call
  f();
  t.equal(f.calledTwice, false, "should be false after one call");

  // True after second call
  f();
  t.equal(f.calledTwice, true, "should be true after two calls");

  // False after third call
  f();
  t.equal(f.calledTwice, false, "should be false after three calls");

  t.end();
});
