import t from "tap";
import sinon from "sinon";

t.test("spy.getCall returns the nth call", (t) => {
  const f = sinon.fake();

  f("a");
  f("b");
  f("c");

  // Get second call (index 1)
  const call = f.getCall(1);
  t.ok(call, "should return a call object");
  t.same(call.args, ["b"], "should have args from second call");
  t.equal(call.firstArg, "b", "firstArg should be 'b'");

  // Reset and verify null
  sinon.reset();
  t.equal(f.getCall(1), null, "should return null after reset");

  t.end();
});
