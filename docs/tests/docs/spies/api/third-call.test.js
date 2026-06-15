import t from "tap";
import sinon from "sinon";

t.test("spy.thirdCall returns the third call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.thirdCall, null, "should be null before any calls");

  // Still null after first call
  f("apple pie");
  t.equal(f.thirdCall, null, "should be null after one call");

  // Still null after second call
  f("blueberry pie");
  t.equal(f.thirdCall, null, "should be null after two calls");

  // Returns third call object after third call
  f("cherry pie");
  t.ok(f.thirdCall, "should have thirdCall after third call");
  t.same(
    f.thirdCall.args,
    ["cherry pie"],
    "thirdCall should have correct args"
  );
  t.equal(
    f.thirdCall.firstArg,
    "cherry pie",
    "firstArg should be 'cherry pie'"
  );

  t.end();
});
