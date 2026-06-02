import t from "tap";
import sinon from "sinon";

t.test("spy.firstCall returns the first call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.firstCall, null, "should be null before any calls");

  // Returns first call object
  f("apple pie");
  t.ok(f.firstCall, "should have firstCall after first call");
  t.same(f.firstCall.args, ["apple pie"], "firstCall should have correct args");
  t.equal(f.firstCall.firstArg, "apple pie", "firstArg should be 'apple pie'");

  // Still returns first call even after second call
  f("blueberry pie");
  t.same(
    f.firstCall.args,
    ["apple pie"],
    "firstCall should still be first call"
  );
  t.equal(
    f.firstCall.firstArg,
    "apple pie",
    "firstArg should still be 'apple pie'"
  );

  t.end();
});
