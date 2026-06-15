import t from "tap";
import sinon from "sinon";

t.test("spy.returnValues contains all return values", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call twice
  const result1 = f();
  t.equal(result1, "apple pie", "first call should return 'apple pie'");

  const result2 = f();
  t.equal(result2, "apple pie", "second call should return 'apple pie'");

  // Verify returnValues array
  t.same(
    f.returnValues,
    ["apple pie", "apple pie"],
    "returnValues should contain both returns"
  );
  t.equal(
    f.returnValues[0],
    "apple pie",
    "returnValues[0] should be 'apple pie'"
  );

  t.end();
});
