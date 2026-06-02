import t from "tap";
import sinon from "sinon";

t.test("spy.called is false initially, true after any call", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.called, false, "should be false before any calls");

  // True after first call
  f();
  t.equal(f.called, true, "should be true after first call");

  // Still true after second call
  f();
  t.equal(f.called, true, "should remain true after multiple calls");

  t.end();
});
