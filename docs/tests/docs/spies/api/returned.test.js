import t from "tap";
import sinon from "sinon";

t.test("spy.returned checks if spy returned a value", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call the fake
  const result = f();
  t.equal(result, "apple pie", "should return 'apple pie'");

  // Verify returned checks
  t.ok(f.returned("apple pie"), "should return true for 'apple pie'");
  t.notOk(
    f.returned("raspberry pie"),
    "should return false for 'raspberry pie'"
  );

  // Reset and verify
  sinon.reset();
  t.notOk(f.returned("apple pie"), "should return false after reset");

  t.end();
});
