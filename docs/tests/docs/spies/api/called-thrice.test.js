import t from "tap";
import sinon from "sinon";

t.test("spy.calledThrice is true only when called exactly three times", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.calledThrice, false, "should be false before any calls");

  // False after first call
  f();
  t.equal(f.calledThrice, false, "should be false after one call");

  // False after second call
  f();
  t.equal(f.calledThrice, false, "should be false after two calls");

  // True after third call
  f();
  t.equal(f.calledThrice, true, "should be true after three calls");

  // False after fourth call
  f();
  t.equal(f.calledThrice, false, "should be false after four calls");

  t.end();
});
