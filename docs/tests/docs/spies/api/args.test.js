import t from "tap";
import sinon from "sinon";

t.test("spy.args contains all arguments from all calls", (t) => {
  const f = sinon.fake();

  // Call with different arguments
  f("a", "b", "c");
  f("d", "e", "f");

  // Verify args structure
  t.same(
    f.args,
    [
      ["a", "b", "c"],
      ["d", "e", "f"]
    ],
    "args should contain all calls"
  );
  t.same(f.args[0], ["a", "b", "c"], "args[0] should be first call arguments");

  t.end();
});
