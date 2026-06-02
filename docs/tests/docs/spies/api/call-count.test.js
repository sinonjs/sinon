import t from "tap";
import sinon from "sinon";

t.test("spy.callCount tracks number of calls", (t) => {
  const f = sinon.fake();

  // Initially 0
  t.equal(f.callCount, 0, "should be 0 before any calls");

  // Increments with each call
  f();
  t.equal(f.callCount, 1, "should be 1 after first call");

  f();
  t.equal(f.callCount, 2, "should be 2 after second call");

  f();
  t.equal(f.callCount, 3, "should be 3 after third call");

  t.end();
});
