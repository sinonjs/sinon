import t from "tap";
import sinon from "sinon";

t.test("spy.lastCall returns the last call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.lastCall, null, "should be null before any calls");

  // Returns first (and only) call object
  f("apple pie");
  t.ok(f.lastCall, "should have lastCall after first call");
  t.same(f.lastCall.args, ["apple pie"], "lastCall should have correct args");
  t.equal(f.lastCall.firstArg, "apple pie", "firstArg should be 'apple pie'");

  // Returns second (now last) call after second call
  f("blueberry pie");
  t.same(
    f.lastCall.args,
    ["blueberry pie"],
    "lastCall should be most recent call"
  );
  t.equal(
    f.lastCall.firstArg,
    "blueberry pie",
    "firstArg should be 'blueberry pie'"
  );

  t.end();
});
