import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysThrew checks if spy always threw", (t) => {
  const f = sinon.fake.throws(new Error("oh dear"));

  // Call twice (catching exceptions)
  try {
    f();
  } catch (e) {
    // Expected
  }
  try {
    f();
  } catch (e) {
    // Expected
  }

  // Verify alwaysThrew
  t.ok(f.alwaysThrew(), "should return true when always threw");

  // Reset
  sinon.reset();
  t.notOk(f.alwaysThrew(), "should return false after reset");

  t.end();
});

t.test("spy.alwaysThrew checks for specific exception type", (t) => {
  const f = sinon.fake.throws(new TypeError("a specific error"));

  // Call twice (catching exceptions)
  try {
    f();
  } catch (e) {
    // Expected
  }
  try {
    f();
  } catch (e) {
    // Expected
  }

  // Verify alwaysThrew with type
  t.ok(f.alwaysThrew("TypeError"), "should return true for matching type");
  t.notOk(
    f.alwaysThrew("ArgumentError"),
    "should return false for non-matching type"
  );

  // Reset
  sinon.reset();
  t.notOk(f.alwaysThrew("TypeError"), "should return false after reset");

  t.end();
});
