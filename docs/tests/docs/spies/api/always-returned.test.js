import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysReturned checks if spy always returned value", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call twice
  f();
  f();

  // Verify alwaysReturned checks
  t.ok(f.alwaysReturned("apple pie"), "should return true for 'apple pie'");
  t.notOk(
    f.alwaysReturned("raspberry pie"),
    "should return false for 'raspberry pie'"
  );

  // Reset and verify
  sinon.reset();
  t.notOk(f.alwaysReturned("apple pie"), "should return false after reset");

  t.end();
});
