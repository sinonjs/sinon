import t from "tap";
import sinon from "sinon";

t.test("spy.secondCall returns the second call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.secondCall, null, "should be null before any calls");

  // Still null after first call
  f("apple pie");
  t.equal(f.secondCall, null, "should be null after only one call");

  // Returns second call object after second call
  f("blueberry pie");
  t.ok(f.secondCall, "should have secondCall after second call");
  t.same(
    f.secondCall.args,
    ["blueberry pie"],
    "secondCall should have correct args"
  );
  t.equal(
    f.secondCall.firstArg,
    "blueberry pie",
    "firstArg should be 'blueberry pie'"
  );

  t.end();
});
