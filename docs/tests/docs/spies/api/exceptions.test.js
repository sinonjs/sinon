import t from "tap";
import sinon from "sinon";

t.test("spy.exceptions contains all thrown exceptions", (t) => {
  const error = new TypeError("apple pie");
  const f = sinon.fake.throws(error);

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

  // Verify exceptions array
  t.equal(f.exceptions.length, 2, "should have 2 exceptions");
  t.equal(f.exceptions[0], error, "first exception should be the error");
  t.equal(f.exceptions[1], error, "second exception should be the error");
  t.equal(
    f.exceptions[0].message,
    "apple pie",
    "exception message should match"
  );

  t.end();
});
