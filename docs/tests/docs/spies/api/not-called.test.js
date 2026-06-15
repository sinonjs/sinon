import t from "tap";
import sinon from "sinon";

t.test("spy.notCalled is true only when never called", (t) => {
  const f = sinon.fake();

  // Initially true
  t.equal(f.notCalled, true, "should be true before any calls");

  // False after first call
  f();
  t.equal(f.notCalled, false, "should be false after first call");

  // Still false after second call
  f();
  t.equal(f.notCalled, false, "should remain false after multiple calls");

  t.end();
});
