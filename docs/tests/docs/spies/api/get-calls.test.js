import t from "tap";
import sinon from "sinon";

t.test("spy.getCalls returns array of all call objects", (t) => {
  const f = sinon.fake();

  f("a");
  f("b");

  const calls = f.getCalls();

  // Verify we have two call objects
  t.equal(calls.length, 2, "should have 2 calls");

  // Verify first call
  t.ok(calls[0], "first call should exist");
  t.same(calls[0].args, ["a"], "first call should have args ['a']");
  t.equal(calls[0].firstArg, "a", "first call firstArg should be 'a'");

  // Verify second call
  t.ok(calls[1], "second call should exist");
  t.same(calls[1].args, ["b"], "second call should have args ['b']");
  t.equal(calls[1].firstArg, "b", "second call firstArg should be 'b'");

  t.end();
});
