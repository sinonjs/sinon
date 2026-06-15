import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledOnceWith", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns false when spy has not been called"
  );

  spy("apple pie", "coffee");
  t.ok(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns true when spy was called exactly once with arguments"
  );

  spy("apple pie", "coffee");
  t.notOk(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns false when spy was called more than once"
  );

  t.end();
});
